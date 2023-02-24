import { useRef, createContext, useContext, useState } from "react"

const CameraContext = createContext();

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const [ cameraError, setCameraError ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(false);
    const [ contrastOffset, setContrastOffset] = useState(0);
    const [ brightnessOffset, setBrightnessOffset] = useState(0);
    const [ snapshot, setSnapshot ] = useState(null);

    const initVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true });
            
            video.current = document.createElement("video");
            video.current.srcObject = stream;
            video.current.play();

          } catch(err) {
            setCameraError(true);
          }
    }

    const initFeed = async () => {
        if(!video.current) await initVideo();
        
        const context = output.current.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });

        clearInterval(drawInterval.current);        
        setCameraEnabled(true);

        drawInterval.current = setInterval(() => {
            if(!video.current) return;
            const min = Math.min(video.current.videoWidth, video.current.videoHeight);
            const sx=(video.current.videoWidth-min)/2;
            const sy=(video.current.videoHeight-min)/2;
            context.drawImage(video.current, sx, sy, min, min, 0, 0, 128, 128);
            context.drawImage(output.current, 0, 0, output.current.width, output.current.width);
            // context.drawImage(output.current,sx,sy,min,min,0,0,output.current.width,output.current.height);
            applyPalette(context)
        },100)
    }   

    const applyPalette = (context) => {
        const palette = ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"];
        const imgData = context.getImageData(0,0,output.current.width,output.current.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            let avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
            let closest = 0;

            for (let j = 0; j < palette.length - 1; j++) {
                if (avg >= (j * 255 / (palette.length - 1)) && avg <= ((j + 1) * 255 / (palette.length - 1))) {
                    closest = j;
                    break;
                }
            }

            let color1 = palette[closest];
            let color2 = palette[closest + 1];
            let t = (avg - (closest * 255 / (palette.length - 1))) / (255 / (palette.length - 1));

            imgData.data[i] = color1[0] + (color2[0] - color1[0]) * t;
            imgData.data[i + 1] = color1[1] + (color2[1] - color1[1]) * t;
            imgData.data[i + 2] = color1[2] + (color2[2] - color1[2]) * t;
        }

        context.putImageData(imgData,0,0)
    }

    const takeSnapshot = () => {
        setSnapshot(output.current.toDataURL());
    }

    return (
        <CameraContext.Provider value={{ initFeed, takeSnapshot, cameraEnabled, cameraError, output, snapshot }}>
            { children }
        </CameraContext.Provider>
    )
}

const useCamera = () => {
    const context = useContext(CameraContext);
    if(context === undefined) throw new Error("useCamera must be used within a CameraProvider");
    return context;
}

export { CameraProvider, useCamera }
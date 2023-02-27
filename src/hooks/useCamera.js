import { createContext, useCallback, useContext, useRef, useState } from "react"

const CameraContext = createContext();

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const [ cameraError, setCameraError ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(false);
    const [ contrast, setContrast] = useState(0);
    const [ brightness, setBrightness] = useState(0);
    const [ snapshot, setSnapshot ] = useState(null);    

    const applyBrightness = useCallback((context) => {
        context.globalCompositeOperation = "lighten";
        context.globalAlpha = brightness; // 0-1
        context.fillStyle = "white";
        context.fillRect(0,0,context.canvas.width,context.canvas.height);            
        context.globalCompositeOperation = "copy";
        context.globalAlpha = 1; 
    }, [brightness]);

    const applyContrast = useCallback((context) => {
        const imgData = context.getImageData(0,0,output.current.width,output.current.height);
        context.globalCompositeOperation = "darken";
        context.globalAlpha = contrast; // 0-1
        context.putImageData(imgData,0,0)       
        context.globalCompositeOperation = "copy";
        context.globalAlpha = 1; 
    }, [contrast]);

    const applyPalette = (context) => {
        const palette = ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"];
        const imgData = context.getImageData(0,0,output.current.width,output.current.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            // let avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3; // Without Grayscale
            let avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3 * imgData.data[i + 3] / 255; // Grayscale
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

    const initVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true });

            video.current = document.createElement("video");
            video.current.srcObject = stream;
            video.current.play();
                    
            setCameraEnabled(true);
            setCameraError(false);
          } catch(err) {
            setCameraEnabled(false);
            setCameraError(true);
          }
    }

    const initFeed = useCallback(async () => {
        if(!video.current) await initVideo();
        
        const context = output.current.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });

        clearInterval(drawInterval.current);

        drawInterval.current = setInterval(() => {
            if(!video.current) return;
            const size = 128
            const sMin = Math.min(video.current.videoWidth, video.current.videoHeight);
            const dMin = Math.min(output.current.width, output.current.height);
            const sx = ( video.current.videoWidth - sMin ) / 2;
            const sy = ( video.current.videoHeight - sMin ) / 2;

            context.drawImage(video.current, sx, sy, sMin, sMin, 0, 0, size, size);
            
            applyContrast(context);
            applyBrightness(context);
            applyPalette(context);

            context.drawImage(output.current, 0, 0, size, size, 0, 0, dMin, dMin);         
        },17)
    }, [applyBrightness, applyContrast, video])

    const takeSnapshot = () => {
        setSnapshot(output.current.toDataURL());
    }

    return (
        <CameraContext.Provider 
            value={{ 
                initFeed, 
                setBrightness, 
                setContrast,
                takeSnapshot,
                cameraEnabled,
                cameraError,
                output,
                snapshot 
            }}
        >
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
import { createContext, useCallback, useContext, useRef, useState } from "react"

import { similarColor } from "../helpers/colors";

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
        context.globalCompositeOperation = "darken";
        context.globalAlpha = contrast; // 0-1
        context.fillStyle = "black";
        context.fillRect(0,0,context.canvas.width,context.canvas.height);
        context.globalCompositeOperation = "copy";
        context.globalAlpha = 1; 
    }, [contrast]);

    const convertPalette = (context) => {
        const palette = [[34, 73, 57], [54, 119, 74], [77, 163, 80], [132, 205, 110]];
        const width = output.current.width;
        const height = output.current.height;
        const imgData = context.getImageData(0,0,width,height);
        
        for (let y = 0; y < imgData.height; y++) {
          for (let x = 0; x < imgData.width; x++) {
            let i = y * 4 * imgData.width + x * 4;
            const color = similarColor([ imgData.data[i], imgData.data[i + 1], imgData.data[i + 2] ], palette);
            
            imgData.data[i] = color[0];
            imgData.data[i + 1] = color[1];
            imgData.data[i + 2] = color[2];
          }
        }

        context.putImageData(imgData, 0, 0);
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
            const size = 128;
            const sMin = Math.min(video.current.videoWidth, video.current.videoHeight);
            const dMin = Math.min(output.current.width, output.current.height);
            const sx = ( video.current.videoWidth - sMin ) / 2;
            const sy = ( video.current.videoHeight - sMin ) / 2;

            context.drawImage(video.current, sx, sy, sMin, sMin, 0, 0, size, size);
            
            applyContrast(context);
            applyBrightness(context);
            convertPalette(context);

            context.drawImage(output.current, 0, 0, size, size, 0, 0, dMin, dMin);         
        },17)
    }, [applyBrightness, applyContrast, video])

    const takeSnapshot = () => {
        const c = document.createElement("canvas");
        const context = c.getContext("2d");
        c.width = 1024;
        c.height = 1024;
        context.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, 1024, 1024);
        setSnapshot(c.toDataURL());
    }

    const save = () => {
        let a = document.createElement("a");
        a.href = snapshot; 
        a.download = `${Date.now()}.jpg`;
        a.click();
    }

    return (
        <CameraContext.Provider 
            value={{ 
                initFeed, 
                save,
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
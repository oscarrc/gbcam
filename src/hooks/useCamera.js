import { useRef, createContext, useContext, useState } from "react"

const CameraContext = createContext();

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const drawInterval = useRef(null);

    const initCamera = async () => {
        const feed = await navigator.mediaDevices.getUserMedia({video:true});
        if(!feed) return; // No camera or no permission given        
        video.current = document.createElement("video");
        video.current.srcObject = feed;
        console.log(video.current.srcObject)
    }

    const initFeed = async (canvas) => {
        if(!canvas) return;

        const context = canvas.getContext("2d");

        await initCamera(canvas);

        clearInterval(drawInterval.current);

        drawInterval.current = setInterval(() => {
            if(!video.current) return;
            const min = Math.min(video.current.videoWidth, video.current.videoHeight);
            const sx=(video.current.videoWidth-min)/2;
            const sy=(video.current.videoHeight-min)/2;
            context.drawImage(video.current,sx,sy,min,min,0,0,canvas.width,canvas.height);
        },100)
    }   

    return (
        <CameraContext.Provider value={{ initFeed, initCamera }}>
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
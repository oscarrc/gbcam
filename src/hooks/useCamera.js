import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

const CameraContext = createContext();
// https://github.com/NielsLeenheer/CanvasDither
// Use canvas filters brightness, contrast and invert
const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const recorder = useRef(null);
    const player = useRef(null);
    const dSize = 1024;
    const offset = 60;

    const isRecording = useMemo(() => recorder.current !== null, [recorder]);
    const [ cameraError, setCameraError ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(false);
    const [ contrast, setContrast] = useState(51);
    const [ brightness, setBrightness] = useState(51);
    const [ snapshot, setSnapshot ] = useState(null);  
    const [ recording, setRecording ] = useState(null);
    const [ selfie, setSelfie ] = useState(true);
    const [ frame, setFrame ] = useState(0);   
    const [ palette, setPalette ] = useState(0)
    const [ constraints ] = useState(navigator.mediaDevices.getSupportedConstraints());
    
    const swapPalette = useCallback((context) => {
        const pixels = context.getImageData(0,0,output.current.width,output.current.height);
        const swapped = convertPalette(pixels, palette);
        context.putImageData(swapped, 0, 0);
    }, [palette])

    const applyDither = useCallback((context) => {
        const pixels = context.getImageData(0,0,output.current.width,output.current.height);
        const dithered = gbDither(pixels, brightness, contrast, 0.6)
        context.putImageData(dithered, 0, 0);
    }, [brightness, contrast])

    const drawFrame = useCallback((context) => {         
        const img = document.createElement("img");
        let src;

        if(snapshot || recording){
            src = require(`../assets/frames/frame-${frame}.png`);
        }else{            
            src = require(`../assets/frames/controls.png`);
        }

        img.src = src;
        context.drawImage(img, 0, 0, output.current?.width, output.current?.height);
    }, [frame, recording, snapshot])

    const drawFeed = useCallback((context) => {
        if(!video.current) return;
        const w = output.current?.width;
        const h = output.current?.height
        const d = Math.min(w, h) - offset;
        const dx = ( w - d ) / 2;
        const dy = ( h - d ) / 2;
    
        const sMin = Math.min(video.current.videoWidth, video.current.videoHeight);
        const sx = ( video.current.videoWidth - sMin ) / 2;
        const sy = ( video.current.videoHeight - sMin ) / 2;

        context.drawImage(video.current, sx, sy, sMin, sMin, dx, dy, d, d); 

        applyDither(context);
    }, [applyDither]);

    const drawSnapshot = useCallback((context) => {
        const dMin = Math.min(output.current?.width, output.current?.height);
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, dSize, dSize, 0, 0, dMin, dMin); 
        image.src = URL.createObjectURL(snapshot);
    }, [snapshot])

    const drawRecording = useCallback((context) => {
        const dMin = Math.min(output.current?.width, output.current?.height);

        if(!player.current){
            player.current = document.createElement( 'video' );
            player.current.muted = true;
            player.current.loop = true;
            player.current.src = URL.createObjectURL( recording );
            player.current.play();
        }
        
        context.drawImage(player.current, 0, 0, dSize, dSize, 0, 0, dMin, dMin);              
    }, [player, recording])

    const initCamera = useCallback(async () => {
        const context = output.current?.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });

        clearInterval(drawInterval.current);

        drawInterval.current = setInterval(() => { 
            if(snapshot) drawSnapshot(context);
            else if(recording) drawRecording(context);
            else drawFeed(context);
                          
            drawFrame(context);
            swapPalette(context);
        }, 17)
    }, [snapshot, recording, drawSnapshot, drawRecording, drawFeed, drawFrame, swapPalette])
    
    const initVideo = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: selfie ? 'user' : 'environment',
                    frameRate: { ideal: 60 },
                    resizeMode: "crop-and-scale",
                    width: 128,
                    height: 128
                }
            });

            video.current = document.createElement("video");
            video.current.srcObject = stream;
            video.current.play();
                    
            setCameraEnabled(true);
            setCameraError(false);
          } catch(err) {
            setCameraEnabled(false);
            setCameraError(true);
          }
    }, [selfie]);

    const takeSnapshot = () => {
        const c = document.createElement("canvas");
        const context = c.getContext("2d");
        c.width = dSize;
        c.height = dSize;
        context.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, dSize, dSize);
        setSnapshot(c.toDataURL('image/png'))
    }

    const startRecording = () => {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        
        c.width = dSize;
        c.height = dSize;

        let interval = setInterval(() => {
            ctx.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, dSize, dSize);
        }, 17);

        let chunks = [];
        const stream = c.captureStream(60);
        
        recorder.current = new MediaRecorder(stream);
        recorder.current.ondataavailable = (e) => chunks.push(e.data);
        recorder.current.onstop = () => {
            let blob = new Blob(chunks, { 'type' : 'video/mp4' });
            clearInterval(interval);
            setRecording(blob);
            recorder.current = null;
        }

        recorder.current.start();
    }

    const stopRecording = () => {
        if(recorder.current) recorder.current.stop();
    }

    const save = () => {
        let a = document.createElement("a");
        a.href = snapshot ? snapshot : URL.createObjectURL(recording);        
        a.download = `${Date.now()}.${snapshot ? "png" : "mp4"}`;
        a.click();
    }

    const clear = () => {
        if(snapshot) setSnapshot(null);
        if(recording){
            setRecording(null);
            if(player.current) player.current = null;
            if(recorder.current) recorder.current = null;
        };
    }

    const flipCamera = () => setSelfie(s => !s);

    const selectFrame = (dir) => {
        const limit = 10;
        if( dir < 0 && frame + dir < 0 ) return
        if( dir > 0 && frame + dir > limit ) return
        setFrame(f => f + dir);
    }

    useEffect(() => { initVideo() }, [initVideo])

    return (
        <CameraContext.Provider 
            value={{ 
                clear,
                initCamera, 
                flipCamera,
                save,
                selectFrame,
                setBrightness, 
                setContrast,
                setPalette,
                takeSnapshot,
                startRecording,
                stopRecording,
                isRecording,
                brightness,
                cameraEnabled,
                cameraError,
                constraints,
                contrast,
                output,
                recording,
                selfie,
                snapshot,
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
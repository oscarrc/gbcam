import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { getCanvasImage } from "../helpers/canvas";

const CameraContext = createContext();
// https://github.com/NielsLeenheer/CanvasDither

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const recorder = useRef(null);
    const player = useRef(null);

    const isRecording = useMemo(() => recorder.current !== null, [recorder]);
    const [ cameraError, setCameraError ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(false);
    const [ contrast, setContrast] = useState(51);
    const [ brightness, setBrightness] = useState(51);
    const [ snapshot, setSnapshot ] = useState(null);  
    const [ recording, setRecording ] = useState(null);
    const [ selfie, setSelfie ] = useState(true);
    const [ options, setOptions ] = useState(false);
    const [ frame, setFrame ] = useState(0);   
    const [ palette, setPalette ] = useState(0);
    const [ constraints ] = useState(navigator.mediaDevices.getSupportedConstraints());
    
    // Image modification
    const swapPalette = useCallback((canvas) => {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const imgData = context.getImageData(0,0,output.current.width,output.current.height);
        const swapped = convertPalette(imgData, palette);
        context.putImageData(swapped, 0, 0);
    }, [palette])

    const applyDither = useCallback((context, x, y, w, h) => {
        const imgData = context.getImageData(x, y, w, h);
        const dithered = gbDither(imgData, brightness, contrast, 0.6)
        context.putImageData(dithered, x, y, 0, 0, w, h);
    }, [brightness, contrast])

    // Draw to canvas
    const drawFrame = useCallback((context) => {         
        const img = document.createElement("img");
        img.src = `assets/frames/frame-${frame}.svg`;

        const { width, height } = output.current;
        const fr = getCanvasImage(img, width, height);

        swapPalette(fr)
        context.drawImage(fr, 0, 0, output.current?.width, output.current?.height);
    }, [frame, swapPalette])

    const drawUI = useCallback((context) => {
        const img = document.createElement("img");
        img.src = `assets/ui/${snapshot || recording ? 'save' : options ? "options" : "controls"}.svg`;

        const { width, height } = output.current;
        const ui = getCanvasImage(img, width, height);
        swapPalette(ui);       
         
        context.drawImage(ui, 0, 0, width, height);
    }, [options, recording, snapshot, swapPalette])
    
    const drawSnapshot = useCallback((context) => {
        const { width, height } = output.current;
        const image = document.createElement("img"); 
        image.src = snapshot;
        context.drawImage(image, 0, 0, width, height, 0, 0, width, height);
    }, [snapshot])

    const drawRecording = useCallback((context) => {
        const { width, height } = output.current

        if(!player.current){
            player.current = document.createElement( 'video' );
            player.current.muted = true;
            player.current.loop = true;
            player.current.src = URL.createObjectURL( recording );
            player.current.play();
        }
        
        context.drawImage(player.current, 0, 0, width, height, 0, 0, width, height);              
    }, [player, recording])

    const drawFeed = useCallback((context) => {
        if(!video.current) return;

        const { width, height } = output.current;
        const ox = 60 * width / 300
        const oy = 60 * height / 300
        const dw = width - ox;
        const dh = height - oy;
        const dx = ( width - dw ) / 2;
        const dy = ( height - dh ) / 2;
    
        const sw = video.current.videoWidth;
        const sh = video.current.videoHeight;
        const sx = ( video.current.videoWidth - sw ) / 2;
        const sy = ( video.current.videoHeight - sh ) / 2;

        context.drawImage(video.current, sx, sy, sw, sh, dx, dy, dw, dh); 
        applyDither(context, dx, dy, dw, dh);               
        swapPalette(output.current);
    }, [applyDither, swapPalette]);

    // Camera initialization
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
                                       
            drawUI(context);
        }, 17)
    }, [snapshot, recording, drawSnapshot, drawRecording, drawFeed, drawUI])
    
    const initVideo = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: selfie ? 'user' : 'environment',
                    frameRate: { ideal: 60 },
                    resizeMode: "crop-and-scale",
                    width: 128,
                    height: 112
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

    // Capture functions
    const takeSnapshot = () => {
        const { width, height } = output.current
        const img = getCanvasImage(output.current, width, height);
        setSnapshot(img.toDataURL('image/png'))
    }

    const startRecording = () => {
        const { width, height } = output.current;
        const feed = getCanvasImage(output.current, width, height);
        const feedCtx = feed.getContext("2d");

        let interval = setInterval(() => {
            feedCtx.drawImage(output.current, 0, 0, width, height, 0, 0, width, height);
        }, 17);

        let chunks = [];
        const stream = feed.captureStream(60);
        
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

    // Utilities
    const flipCamera = () => setSelfie(s => !s);
    const toggleOptions = () => setOptions( o => !o);

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
                startRecording,
                stopRecording,
                takeSnapshot,
                toggleOptions,
                isRecording,
                brightness,
                cameraEnabled,
                cameraError,
                constraints,
                contrast,
                options,
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
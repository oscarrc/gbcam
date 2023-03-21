import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import fontface from "../assets/fonts/Rounded_5x5.ttf";
import { getCanvasImage } from "../helpers/canvas";

const CameraContext = createContext();
// https://github.com/NielsLeenheer/CanvasDither

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const recorder = useRef(null);
    const player = useRef(null);

    const [ cameraError, setCameraError ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(false);
    const [ contrast, setContrast] = useState(51);
    const [ brightness, setBrightness] = useState(51);
    const [ snapshot, setSnapshot ] = useState(null);  
    const [ recording, setRecording ] = useState(null);
    const [ selfie, setSelfie ] = useState(true);
    const [ option, setOption ] = useState(-1);
    const [ frame, setFrame ] = useState(8);   
    const [ palette, setPalette ] = useState(0);
    const [ negative, setNegative ] = useState(false);
    const [ constraints ] = useState(navigator.mediaDevices.getSupportedConstraints());

    const getDimensions = useCallback(() => {
        const { width, height } = output.current ? output.current : { width: 0, height: 0};
        const { videoWidth, videoHeight } = video.current ? video.current : { videoWidth: 0, videoHeight: 0 }
            
        const ox = 60 * width / 300;
        const oy = 60 * height / 300;
        const dw = width - ox;
        const dh = height - oy;
        const dx = ( width - dw ) / 2;
        const dy = ( height - dh ) / 2;
    
        const sw = videoWidth;
        const sh = videoHeight;
        const sx = ( videoWidth - sw ) / 2;
        const sy = ( videoHeight - sh ) / 2;

        return { width, height, ox, oy, dw, dh, dx, dy, sw, sh, sx, sy }
    }, [video, output])
    
    // Image modification
    const swapPalette = useCallback((canvas) => {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const imgData = context.getImageData(0,0,output.current.width,output.current.height);
        const swapped = convertPalette(imgData, palette);
        context.putImageData(swapped, 0, 0);
    }, [palette])

    const applyDither = useCallback((context, x, y, w, h) => {
        const imgData = context.getImageData(x, y, w, h);
        const dithered = gbDither(imgData, brightness, contrast, 0.6, negative)
        context.putImageData(dithered, x, y, 0, 0, w, h);
    }, [brightness, contrast, negative])

    // Draw to canvas
    const drawFrame = useCallback((context) => new Promise( (resolve) => {         
        const img = document.createElement("img");
        img.src = `assets/frames/frame-${frame}.svg`;

        img.onload = () => {
            const { width, height } = output.current;
            const fr = getCanvasImage(img, width, height);

            swapPalette(fr)
            context.drawImage(fr, 0, 0, width, height);

            resolve();
        }
    }), [frame, swapPalette])

    const drawFrameSelector = useCallback((context) => {
        const img = document.createElement("img");
        img.src = `assets/ui/frames.svg`;

        const { width, height } = output.current;
        const selector = getCanvasImage(img, width, height);
        const ctx = selector.getContext("2d");
        const x = width * 81 / 160;
        const y = height * 88 / 144;
        const s = height * 24 / 144

        ctx.font = `${s}px Rounded_5x5`;
        ctx.fillText(`${frame < 10 ? '0' : ''}${frame}`, x, y);
        swapPalette(selector)
        context.drawImage(selector, 0, 0, width, height);
    }, [frame, swapPalette])
    
    const drawIndicator = ( context, value, vertical ) => {
        
    }

    const drawUI = useCallback((context) => {
        const img = document.createElement("img");
        img.src = `assets/ui/${(snapshot || recording) ? 'save' : option !== -1 ? "options" : "controls"}.svg`;
     
            const { width, height } = output.current;
            const ui = getCanvasImage(img, width, height);

            swapPalette(ui);            
            context.drawImage(ui, 0, 0, width, height);
    }, [option, recording, snapshot, swapPalette])
    
    const drawSnapshot = useCallback((context) => {
        const { width, height } = output.current;
        const img = document.createElement("img"); 
        img.src = snapshot;
        context.drawImage(img, 0, 0, width, height, 0, 0, width, height);
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
        const { sx, sy, sw, sh, dx, dy, dw, dh } = getDimensions();

        context.drawImage(video.current, sx, sy, sw, sh, dx, dy, dw, dh); 
        applyDither(context, dx, dy, dw, dh);               
        swapPalette(output.current);
    }, [applyDither, getDimensions, swapPalette]);

    // Camera initialization
    const initCamera = useCallback(() => {
        const context = output.current?.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });

        clearInterval(drawInterval.current);

        drawInterval.current = setInterval(async () => {
            if(snapshot)  drawSnapshot(context);
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
    const takeSnapshot = async () => {
        const { width, height } = getDimensions();
        const img = getCanvasImage(output.current, width, height);
        const ctx = img.getContext("2d");
        await drawFrame(ctx);
        setSnapshot(img.toDataURL('image/png'));
    }

    const startRecording = async () => {
        const { width, height, dx, dy, dw, dh } = getDimensions();
        const feed = getCanvasImage(null, width, height);
        const feedCtx = feed.getContext("2d");        
        
        await drawFrame(feedCtx);

        let interval = setInterval(async () => {
            feedCtx.drawImage(output.current, dx, dy + 1, dw, dh - 2, dx, dy + 1, dw, dh - 2);
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

    const selectFrame = (dir) => {
        const limit = 17;
        if( dir < 0 && frame + dir < 0 ) return
        if( dir > 0 && frame + dir > limit ) return
        setFrame(f => f + dir);
    }

    const toggleNegative = () => setNegative(n => !n)

    useEffect(() => { initVideo() }, [initVideo])
    useEffect(() => {
        const font = new FontFace("Rounded_5x5", `url(${fontface})`);
        font.load().then( (f) => document.fonts.add(f) );
    }, [])

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
                setOption,
                setPalette,
                startRecording,
                stopRecording,
                takeSnapshot,
                brightness,
                cameraEnabled,
                cameraError,
                constraints,
                contrast,
                option,
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
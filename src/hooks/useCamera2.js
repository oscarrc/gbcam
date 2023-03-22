import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { gbDither, convertPalette } from "../helpers/dither";
import fontface from "../assets/fonts/Rounded_5x5.ttf";
import { loadImage, getCanvasImage } from "../helpers/canvas";
import { dataToFile } from "../helpers/file";

const CameraContext = createContext();
// https://github.com/NielsLeenheer/CanvasDither

const CameraReducer = (state, action) => {
    const { type, payload } = action;
    let value;

    switch(type){
        case "brightness":
            value = payload > 0 && state.brightess < 254 ? state.brightness + 1 : state.brightness > 0 ? state.brightness -1 : 0
            break;
        case "contrast":
            value = payload > 0 && state.brightess < 254 ? state.brightness + 1 : state.brightness > 0 ? state.brightness -1 : 0
            break;
        case "ratio":
            value = payload > 0 && state.brightess <= 4 ? state.ratio + .1 : state.ratio > 0 ? state.ratio -.1 : 0
            break;
        case "negative":
            value = Boolean(payload);
            break;
        default:
            return state;
    }

    return { ...state, [type]: value }
};

const CameraDimensions = {
    width: 160,
    height: 144,
    sw: 128,
    sh: 112,
    sx: 16,
    sy: 16
}

const CameraProvider = ({ children }) => {
    const interval = useRef(null);
    const video = useRef(null);
    const source = useRef(null);
    const output = useRef(null);
    const player = useRef(null);
    const recorder = useRef(null);

    const [ facingUser, setFacingUser ] = useState(true);
    const [ option, setOption ] = useState(false);
    const [ frame, setFrame ] = useState(0);
    const [ media, setMedia ] = useState(null);
    const [ state, dispatch ] = useReducer(CameraReducer, { brightness:51, contrast: 51, ratio: 0.6, negative: false });

    const init = useCallback(async () => {
        const { sw, sh } = CameraDimensions;

        video.current = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingUser ? 'user' : 'environment',
                frameRate: { ideal: 60 },
                resizeMode: "crop-and-scale",
                width: sw,
                height: sh
            }
        });

        source.current = document.createElement("video");
        source.current.srcObject = video;
        source.current.play();
    }, [facingUser])

    const stream = useCallback(() => {
        const { width, height, sx, sy, sw, sh } = CameraDimensions;

        output.current = document.createElement("canvas")
        output.current.width = width;
        output.current.height = height;

        clearInterval(interval);

        interval.current = setInterval(() => {
            const ctx = output.current.getContext("2d");
            const { brightness, contrast, ratio, negative } = state;
            
            ctx.drawImage(source.current, sx, sy, sw, sh, sx, sy, sw, sh);

            const imgData = ctx.getImageData(sx, sy, sw, sh);
            const dithered = gbDither(imgData, brightness, contrast, ratio, negative);

            ctx.putImageData(dithered, sx, sy, sx, sy, sw, sh);
        }, 17)
    }, [state])

    const ui = useCallback(async () => {   
        const { width, height } = CameraDimensions;
        const ctx = output.current.getContext("2d");
        const img = await loadImage(`assets/ui/ui-${option}.svg`);
        
        ctx.drawImage(img, 0, 0, width, height);

        switch(option){
            case -1:
                ctx.fillStyle = "white";
                ctx.fillRect(30 + 101 * state.contrast / 255, height - 13, 1, 5);
                ctx.fillRect(width - 13, 113 - 82 * state.brightness / 255, 5, 1);
                break;
            case 0:
                break;
            case 1:
                break;
            case 2:
                const fr = await loadImage(`assets/frames/frame-${frame}.svg`);
                ctx.drawImage(fr, 0, 0, width, height);
                break;
            case 3:
                break;
            case 4:
                break;
            default:                
                break;      
        }
    }, [option, state.contrast, state.brightness, frame])

    const play = useCallback(async () => {
        const { width, height } = CameraDimensions;        
        const ctx = output.current.getContext("2d");
        const playback = media instanceof Blob;

        if(playback){
            player.current = document.createElement( 'video' );
            player.current.muted = true;
            player.current.loop = true;
            player.current.src = URL.createObjectURL(media);
            player.current.play();
        }else if(!playback){
            player.current = await loadImage(media);
        }

        ctx.drawImage(player.current, 0, 0, width, height, 0, 0, width, height);     
    }, [media]);

    const palette = useCallback(() => {
        const { width, height } = CameraDimensions;
        const ctx = output.current.getContext("2d", { willReadFrequently: true });
        const imgData = ctx.getImageData(0, 0, width, height);
        const swapped = convertPalette(imgData, state.palette);
        ctx.putImageData(swapped, 0, 0);
    }, [state.palette])

    const capture = {
        async snapshot(){
            const { width, height } = CameraDimensions;
            const img = getCanvasImage(output.current, width, height);
            const ctx = img.getContext("2d");
            const fr = await loadImage(`assets/frames/frame-${frame}.svg`);
            
            ctx.drawImage(fr, 0, 0, width, height);
            setMedia(img.toDataURL('image/png'));
        },
        async start(){
            const { width, height, sx, sy, sw, sh } = CameraDimensions;
            const feed = getCanvasImage(null, width, height);
            const feedCtx = feed.getContext("2d");   

            const fr = await loadImage(`assets/frames/frame-${frame}.svg`);            
            feedCtx.drawImage(fr, 0, 0, width, height);

            let interval = setInterval(async () => {
                feedCtx.drawImage(output.current, sx, sy, sw, sh, sx, sy, sw, sh);
            }, 17);

            let chunks = [];
            const stream = feed.captureStream(60);
            
            recorder.current = new MediaRecorder(stream);
            recorder.current.ondataavailable = (e) => chunks.push(e.data);
            recorder.current.onstop = () => {
                let blob = new Blob(chunks, { 'type' : 'video/mp4' });
                clearInterval(interval);
                setMedia(blob);
                recorder.current = null;
            }

            recorder.current.start();
        },
        stop(){
            if(recorder.current) recorder.current.stop();
        }
    }
    
    const save = () => {
        const a = document.createElement("a");
        const file = dataToFile(media);
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
    }

    const clear = () => {
        player.current = null;
        setMedia(null);      
    }

    useEffect(() => {
        init();

        if(video) play();
        else{
            stream();
            ui();
            palette();
        }
    }, [init, palette, play, stream, ui])

    return (
        <CameraContext.Provider value={{
            clear,
            dispatch,
            play,
            save,
            setFacingUser,
            setFrame,
            setOption,
            media,
            output
        }}>
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
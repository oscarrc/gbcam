import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getCanvas, loadImage } from "../helpers/canvas";
import { palettes, variations } from "../constants/colors";

import { dataToFile } from "../helpers/file";
import fontface from "../assets/fonts/Rounded_5x5.ttf";

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
        case "palette":            
            value = payload >= 0 && payload < palettes.length ? payload : state.palette;
            break;
        case "ratio":
            value = payload > 0 && state.brightess <= 4 ? state.ratio + .1 : state.ratio > 0 ? state.ratio -.1 : 0
            break;
        case "variation":            
            value = payload >= 0 && payload < variations.length ? payload : state.variation;
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

    const [ constraints ] = useState(navigator.mediaDevices.getSupportedConstraints());
    const [ facingUser, setFacingUser ] = useState(true);
    const [ frame, setFrame ] = useState(0);
    const [ media, setMedia ] = useState(null);
    const [ option, setOption ] = useState(-1);
    const [ ready, setReady ] = useState(false);
    const [ state, dispatch ] = useReducer(CameraReducer, { brightness:51, contrast: 51, palette: 0, ratio: 0.6, variation: 0 });

    const init = useCallback(async () => {        
        const { width, height, sw, sh } = CameraDimensions;

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
        source.current.srcObject = video.current;
        source.current.play();      

        output.current = document.createElement("canvas")
        output.current.width = width;
        output.current.height = height;

        return output.current.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });
    }, [facingUser])

    const stream = useCallback((ctx) => {      
        const { sx, sy, sw, sh } = CameraDimensions;
        const { brightness, contrast, ratio, palette, variation } = state;
           
        ctx.drawImage(source.current, 0, 0, sw, sh, sx, sy, sw, sh);

        const imgData = ctx.getImageData(sx, sy, sw, sh);
        const dithered = gbDither(imgData, brightness, contrast, ratio);
        const converted = convertPalette(dithered, palette, variation);

        ctx.putImageData(converted, sx, sy, 0, 0, sw, sh);
    }, [state])

    const ui = useCallback(async (ctx) => {   // Needs to be over the stream
        const { width, height } = CameraDimensions;

        const ui = getCanvas(null, width, height);
        const uiCtx = ui.getContext("2d");

        // const img = await loadImage(`assets/ui/ui${option}.svg`);
        const img = document.createElement("img");
        img.src = `assets/ui/ui${option}.svg`
        
        uiCtx.drawImage(img, 0, 0, width, height);

        switch(option){
            case -1:
                uiCtx.fillStyle = "white";
                uiCtx.fillRect(30 + 101 * state.contrast / 255, height - 13, 1, 5);
                uiCtx.fillRect(width - 13, 113 - 82 * state.brightness / 255, 5, 1);
                break;
            case 0:
                break;
            case 1:
                break;
            case 2:
                const fr = document.createElement("img");
                fr.src = `assets/frames/frame-${frame}.svg`;
                uiCtx.font = `24px Rounded_5x5`;
                uiCtx.fillText(`${frame < 10 ? '0' : ''}${frame}`, 81, 88);
                uiCtx.drawImage(fr, 0, 0, width, height);
                break;
            case 3:
                break;
            case 4:
                break;
            default:                
                break;      
        }

        const imgData = uiCtx.getImageData(0, 0, width, height);
        const converted = convertPalette(imgData, state.palette);
        
        uiCtx.putImageData(converted, 0, 0);
        ctx.drawImage(ui, 0, 0, width, height);
    }, [option, state.palette, state.contrast, state.brightness, frame])

    const play = useCallback(async (ctx) => {
        const { width, height } = CameraDimensions;
        const playback = media instanceof Blob;
        
        if(!player.current){
            if(playback){
                player.current = document.createElement('video');
                player.current.muted = true;
                player.current.loop = true;
                player.current.src = URL.createObjectURL(media);
                player.current.play();
            }else{
                player.current = document.createElement("img"); 
                player.current.src = media;
            }
        }        

        ctx.drawImage(player.current, 0, 0, width, height, 0, 0, width, height);
    }, [media]);

    const capture = {
        async snapshot(){
            const { width, height } = CameraDimensions;
            const pic = getCanvas(output.current, width, height);
            const picCtx = pic.getContext("2d",);

            const fr = await loadImage(`assets/frames/frame-${frame}.svg`);
            const c = getCanvas(fr, width, height);
            const cCtx = c.getContext("2d");
            const imgData = cCtx.getImageData(0, 0, width, height);
            const converted = convertPalette(imgData, state.palette);

            picCtx.putImageData(converted, 0, 0);
            setMedia(pic.toDataURL('image/png'));
        },
        async start(){
            const { width, height, sx, sy, sw, sh } = CameraDimensions;
            const feed = getCanvas(null, width, height);
            const feedCtx = feed.getContext("2d",);   

            const fr = await loadImage(`assets/frames/frame-${frame}.svg`);
            const c = getCanvas(fr, width, height);
            const cCtx = c.getContext("2d");
            const imgData = cCtx.getImageData(0, 0, width, height);
            const converted = convertPalette(imgData, state.palette);

            feedCtx.putImageData(converted, 0, 0);

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
    
    const save = async () => {
        const a = document.createElement("a");
        const file = await dataToFile(media);
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
    }

    const clear = () => {
        player.current = null;
        setMedia(null);
    }

    const start = useCallback(async () => {
        const ctx = await init();
        
        interval.current = setInterval(() => { 
            if(media !== null) play(ctx);
            else stream(ctx);

            ui(ctx);
        })

        setReady(true);
    }, [media, init, play, stream, ui])
    
    useEffect(() => { start() }, [start])
    useEffect(() => { setOption(() => media ? -2 : -1 )}, [media] );
    useEffect(() => {
        const font = new FontFace("Rounded_5x5", `url(${fontface})`);
        font.load().then( (f) => document.fonts.add(f) );
    }, []);

    return (
        <CameraContext.Provider value={{
            clear,
            dispatch,
            save,
            setFacingUser,
            setFrame,
            setOption,
            capture,
            constraints,
            facingUser,
            media,
            output,
            ready
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
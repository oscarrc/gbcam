import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getCanvas, loadImage, loadVideo } from "../helpers/canvas";
import { palettes, variations } from "../constants/colors";

const DIMENSIONS = { width: 160, height: 144, sw: 128, sh: 112, sx: 16, sy: 16 };
const DEFAULT_SETTINGS = { brightness: 51, contrast: 51, frame: 0, fps: 60, palette: 0, ratio: 0.6, variation: 0 }

const GbCamContext = createContext();

const GbCamReducer = (state, action) => {
    const { type, payload } = action;
    let value;

    switch(type){
        case "brightness":
            value = payload > 0 && state.brightess < 254 ? state.brightness + 1 : state.brightness > 0 ? state.brightness -1 : 0
            break;
        case "contrast":
            value = payload > 0 && state.brightess < 254 ? state.brightness + 1 : state.brightness > 0 ? state.brightness -1 : 0
            break;
        case "fps":
            value = payload > 60 || payload < 15 ? state.fps : payload;
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

    state = { ...state, [type]: value }
    localStorage.setItem("settings", JSON.stringify(state));
    
    return state
};

const GbCamProvider = ({ children }) => {
    const [ settings, setting ] = useReducer(GbCamReducer, JSON.parse(localStorage.getItem("settings")) || DEFAULT_SETTINGS );
    const [ option, setOption ] = useState(0);
    const [ facingUser, setFacingUser ] = useState(0);
          
    const { brightness, contrast, frame, fps, palette, ratio, variation } = settings 
    const { width, height, sx, sy, sw, sh } = DIMENSIONS;

    const capture = useRef(null);
    const interval = useRef(null);     
    const output = useRef(null);     
    const player = useRef(null);     
    const recorder = useRef(null);
    const source = useRef(null);

    const timeout = useMemo(() => 1000 / fps, [fps]);

    const context = useMemo(() => {
        if(!output.current) return null;

        return output.current.getgbCamCtx("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });
    }, [output])

    const sourceOptions = useMemo(() => {
        return {
            video: {
                facingMode: facingUser ? 'user' : 'environment',
                frameRate: { ideal: fps },
                resizeMode: "crop-and-scale",
                width: width,
                height: height
            },
            audio: false
        }
    }, [facingUser, fps, height, width])

    const clear = () => {
        capture.current = null;
        player.current = null;
    }

    const init = useCallback(async () => {
        const media = await navigator.mediaDevices.getUserMedia(sourceOptions);

        source.current = loadVideo(media);
        output.current = getCanvas(null, width, height);
    }, [height, sourceOptions, width]);

    const drawUI = useCallback(() => {
        const { selected, value } = option;
        const canvas = getCanvas(null, width, height);
        const ctx = canvas.getContext("2d");

        const img = document.createElement("img");
        img.src = `assets/ui/ui-${option}.svg`

        switch(selected){
            case 0: // Options menu
                break;
            case 1: // Flip
                break;
            case 2: // Frame
                const fr = document.createElement("img");
                fr.src = `assets/frames/frame-${value}.svg`;
                ctx.font = `24px Rounded_5x5`;
                ctx.fillText(`${value < 10 ? '0' : ''}${value}`, 81, 88);
                ctx.drawImage(fr, 0, 0, width, height);
                break;
            case 3: // Palette
                break;
            case 4: // Dither
                break;
            default: // Brightness / Contrast
                const { brightness, contrast } = value;
                img.src = `assets/ui/ui-default.svg`
                ctx.fillStyle = "white";
                ctx.fillRect(30 + 101 * contrast / 255, height - 13, 1, 5);
                ctx.fillRect(width - 13, 113 - 82 * brightness / 255, 5, 1);
                return;
        }

        ctx.drawImage(canvas, 0, 0, width, height);

        return canvas;
    }, [option, width, height])

    const drawVideo = useCallback(() => {
        const canvas = getCanvas(null, sw, sh);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(source.current, 0, 0, sw, sh);

        const imgData = ctx.getImageData(0, 0, sw, sh);
        const dithered = gbDither(imgData, brightness, contrast, ratio);
        const converted = convertPalette(dithered, palette, variation);

        ctx.putImageData(converted, 0, 0);

        return canvas;
    }, [sw, sh, brightness, contrast, ratio, palette, variation])

    const record = useCallback(async (save = false) => {
        if(save) return recorder.current && recorder.current.stop();        
        const recording = getCanvas(null, width, height);        
        const ctx = recording.getContext("2d");        
        const fr = await loadImage(`assets/frames/frame-${frame}`);
        
        let interval = setInterval(async () => {
            const img = drawVideo();

            ctx.drawImage(img, sx, sy, sw, sh)
            ctx.drawImage(fr, 0, 0, width, height);

            const imgData = ctx.getImageData(0, 0, width, height);
            const converted = convertPalette(imgData, palette, variation);

            ctx.putImageData(converted, 0, 0, width, height);
        }, timeout);

        let chunks = [];
        const stream = recording.captureStream(60);

        recorder.current = new MediaRecorder(stream);
        recorder.current.ondataavailable = (e) => chunks.push(e.data);
        recorder.current.onstop = () => {
            let blob = new Blob(chunks, { 'type' : 'video/mp4' });
            
            clearInterval(interval);

            recorder.current = null;
            capture.current = blob;
        }

        recorder.current.start();
    }, [drawVideo, frame, height, palette, sh, sw, sx, sy, timeout, variation, width])

    const snap = useCallback(async () => {
        const img = drawVideo();
        const ctx = img.getContext("2d");
        const fr = await loadImage(`assets/frames/frame-${frame}`);

        ctx.drawImage(img, sx, sy, sw, sh)
        ctx.drawImage(fr, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const converted = convertPalette(imgData, palette, variation);

        ctx.putImageData(converted, 0, 0, width, height);

        capture.current = img;
    }, [drawVideo, frame, height, palette, sh, sw, sx, sy, variation, width])

    const playback = useCallback(() => {
        if(!player.current){
            player.current = capture instanceof Blob ? loadVideo(capture) : loadImage(capture);
        }

        context.drawImage(player.current, 0, 0, width, height, 0, 0, width, height);
    }, [context, height, width])

    const stream = useCallback(() => {
        if(!output.current) return;

        const ui = drawUI();
        const video = drawVideo();

        context.drawImage(video, sx, sy, sw, sh);
        context.drawImage(ui, 0, 0, width, height);
        
        const imgData = context.getImageData(0, 0, width, height);
        const converted = convertPalette(imgData, palette, variation);

        context.putImageData(converted, 0, 0);
    }, [context, drawUI, drawVideo, height, palette, sh, sw, sx, sy, variation, width])

    useEffect(() => init, [init]);

    useEffect(() => { 
        interval.current = setTimeout(() => capture ? playback() : stream(), timeout)
        return () => clearInterval(interval.current)
    }, [playback, stream, timeout])

    return (
        <GbCamContext.Provider value={{ 
            capture: capture.current,
            facingUser,
            option,
            output,
            clear,
            setFacingUser,
            setOption,
            setting,
            snap, 
            record
        }} >
            { children }
        </ GbCamContext.Provider>
    )
}

const useGbCam = () => {
    const context = useContext(GbCamContext);
    if(context === undefined) throw new Error("useGbCam must be used within a GBCamProvider");
    return context;
}

export { GbCamProvider, useGbCam }
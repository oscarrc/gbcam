import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { drawImage, getCanvas, loadImage, loadVideo } from "../helpers/canvas";
import { palettes, variations } from "../constants/colors";

import fontface from "../assets/fonts/Rounded_5x5.ttf";

const DIMENSIONS = { width: 160, height: 144, sw: 128, sh: 112, sx: 16, sy: 16 };
const DEFAULT_SETTINGS = { brightness: 51, contrast: 51, frame: 0, flip: 0, fps: 60, palette: 0, ratio: 0.6, variation: 0 }
const MAX_VALUE = { brightness: 255, contrast: 255, frame: 17, flip: 2 , fps: 60, palette: palettes.length - 1, ratio: 2, variation: variations.length - 1 }
const INCREMENTS = { brightness: 1, contrast: 1, frame: 1, flip: 1, fps: 1, palette: 1, ratio: 0.2, variation: 1 }
const GbCamContext = createContext();

const GbCamReducer = (state, action) => {
    const { type, payload } = action;
    let value;

    if(payload > 0){
        value = state[type] < MAX_VALUE[type] ? state[type] + INCREMENTS[type] : state[type]
    }else{
        value = state[type] > 0 ? state[type] - INCREMENTS[type] : state[type]
    }

    value = value > MAX_VALUE[type] ? MAX_VALUE[type] : value < 0 ? 0 : value

    state = { ...state, [type]: value }
    localStorage.setItem("settings", JSON.stringify(state));
    
    return state
};

const GbCamProvider = ({ children }) => {
    const [ settings, setting ] = useReducer(GbCamReducer, {...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("settings"))} || DEFAULT_SETTINGS );
    const [ option, setOption ] = useState(null);
    const [ facingUser, setFacingUser ] = useState(true);
    const [ capture, setCapture ] = useState(null);
    const [ media, setMedia ] = useState({ source: null, output: null });
          
    const { brightness, contrast, frame, flip, fps, palette, ratio, variation } = settings 
    const { width, height, sx, sy, sw, sh } = DIMENSIONS;

    const interval = useRef(null);     
    const player = useRef(null);     
    const recorder = useRef(null);

    const timeout = useMemo(() => 1000 / fps, [fps]);
    const ready = useMemo(() => media.output !== null, [media]);    
    const context = useMemo(() => {
       return media.output ? media.output.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        }) : null
    }, [media])

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

    const offsets = useMemo(() => {
        let x = 0;
        let y = 0;

        if(option === 1) y = sy;
        if(option === 3) y = -sy;
        if(option === 4) x = sx;

        return { x, y }
    }, [option, sx, sy])

    const clear = () => {
        player.current = null;
        setCapture(null);
    }

    const init = useCallback(async () => {
        const media = await navigator.mediaDevices.getUserMedia(sourceOptions);
        const font = await (new FontFace("Rounded_5x5", `url(${fontface})`)).load();
        const video = loadVideo(media);
        const canvas = getCanvas(null, width, height);
        
        document.fonts.add(font);

        setMedia({source: video, output: canvas})
    }, [height, sourceOptions, width]);

    const drawUI = useCallback(() => {   
        const w = width + Math.abs(offsets.x);
        const h = height + Math.abs(offsets.y);
        const canvas = getCanvas(null, w, h);
        const ctx = canvas.getContext("2d");
        const dPos = [9, 36, 66, 90, 114, 138];
        const uPos = [33, 73, 113];

        switch(option){
            case 0: // Options menu
                drawImage(`assets/ui/ui-options.svg`, ctx, 0, 0, width, height)
                break;
            case 1: // Flip *
                drawImage(`assets/ui/ui-options.svg`, ctx, 0, Math.abs(offsets.y), width, height)
                drawImage(`assets/ui/ui-flip.svg`, ctx, 0, 0, width, Math.abs(offsets.y));                
                drawImage(`assets/ui/ui-UP.svg`, ctx, uPos[flip], 9, 16, 16);
                break;
            case 2: // Frame    
                drawImage(`assets/ui/ui-frame.svg`, ctx, 0, 0, width, height);                           
                drawImage(`assets/frames/frame-${frame}.svg`, ctx, 0, 0, width, height);
                ctx.font = `24px Rounded_5x5`;                
                ctx.fillStyle = "#000000";
                ctx.fillText(`${frame < 10 ? '0' : ''}${frame}`, 81, 88);
                break;
            case 3: // Palette
                drawImage(`assets/ui/ui-options.svg`, ctx, 0, 0, width, height)
                drawImage(`assets/ui/ui-palette.svg`, ctx, 0, height, width, Math.abs(offsets.y));                
                drawImage(`assets/ui/ui-down.svg`, ctx, dPos[variation], height - 8, 16, 16);
                break;
            case 4: // Dither *
                drawImage(`assets/ui/ui-options.svg`, ctx, offsets.x, 0, width, height);
                drawImage(`assets/ui/ui-dither.svg`, ctx, 0, 0, Math.abs(offsets.x), height);
                ctx.fillStyle = "#000000";                
                ctx.fillRect(9, 113 - 82 * ratio / 2, 5, 1);
                break;
            default: // Brightness / Contrast or Save 
                drawImage(`assets/ui/ui-${capture ? 'save' : 'default' }.svg`, ctx, 0, 0, width, height)
                if(!capture){
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(30 + 101 * contrast / 255, height - 13, 1, 5);
                    ctx.fillRect(width - 13, 113 - 82 * brightness / 255, 5, 1);
                }
        }

        return canvas;
    }, [width, offsets.x, offsets.y, height, option, flip, frame, variation, ratio, capture, contrast, brightness])

    const drawVideo = useCallback(() => {
        const canvas = getCanvas(null, sw, sh);
        const ctx = canvas.getContext("2d");
        const tw = flip === 1 ? sw : 0;
        const th = flip === 2 ? sh : 0;
        const tx = flip === 1 ? -1 : 1;
        const ty = flip === 2 ? -1 : 1;

        ctx.save();
        ctx.translate(tw, th);
        ctx.scale(tx, ty);
        ctx.drawImage(media.source, 0, 0, sw, sh);
        ctx.restore();

        const imgData = ctx.getImageData(0, 0, sw, sh);
        const dithered = gbDither(imgData, brightness, contrast, ratio);

        ctx.putImageData(dithered, 0, 0);

        return canvas;
    }, [sw, sh, flip, media.source, brightness, contrast, ratio])

    const swapPalette = (video, ui, palette, variation) => {
        const vCtx = video.getContext("2d");
        const vData = vCtx.getImageData(0, 0, ui.width, ui.height);  
        const vConverted = convertPalette(vData, palette, variation);      
        const uCtx = ui.getContext("2d");
        const uData = uCtx.getImageData(0, 0, ui.width, ui.height);
        const uConverted = convertPalette(uData, palette, 0);   

        vCtx.putImageData(vConverted, 0, 0);
        uCtx.putImageData(uConverted, 0, 0);
    }

    const record = async (save = false) => {
        if(save) return recorder.current && recorder.current.stop();        
        const recording = getCanvas(null, width, height);        
        const ctx = recording.getContext("2d", { willReadFrequently: true });        
        const fr = await loadImage(`assets/frames/frame-${frame}`);
        
        let interval = setInterval(async () => {
            const img = drawVideo();

            ctx.drawImage(img, sx, sy, sw, sh)
            ctx.drawImage(fr, 0, 0, width, height);

            swapPalette(img, fr, palette, variation);
        }, timeout);

        let chunks = [];
        const stream = recording.captureStream(60);

        recorder.current = new MediaRecorder(stream);
        recorder.current.ondataavailable = (e) => chunks.push(e.data);
        recorder.current.onstop = () => {
            let blob = new Blob(chunks, { 'type' : 'video/mp4' });
            
            setCapture(blob);
            clearInterval(interval);
            recorder.current = null;
        }

        recorder.current.start();
    }

    const snap = async () => {
        const img = drawVideo();
        const canvas = getCanvas(null, width, height);
        const ctx = canvas.getContext("2d");
        const fr = await loadImage(`assets/frames/frame-${frame}`);
        
        ctx.drawImage(img, sx, sy, sw, sh)
        ctx.drawImage(fr, 0, 0, width, height);
        
        swapPalette(img, fr, palette, variation);
        setCapture(canvas.toDataURL('image/png'));
    }

    const playback = useCallback(() => {
        if(!player.current){
            player.current = capture instanceof Blob ? loadVideo(capture) : loadImage(capture);
        }
        
        context.drawImage(player.current, 0, 0, width, height, 0, 0, width, height);
    }, [capture, context, height, width])

    const stream = useCallback(() => {
        if(!context) return;
        const uiw = width + Math.abs(offsets.x);
        const uih = height + Math.abs(offsets.y);

        const ui = drawUI();        
        const video = drawVideo();

        swapPalette(video, ui, palette, variation);
        
        context.drawImage(video, sx + offsets.x, sy + offsets.y, sw, sh);
        context.drawImage(ui, 0, 0 + offsets.y < 0 && offsets.y, uiw, uih);
    }, [context, drawUI, drawVideo, height, offsets, palette, sh, sw, sx, sy, variation, width])

    useEffect(() => { init() }, [init])

    useEffect(() => { 
        interval.current = setInterval(() => capture ? playback() : stream(), timeout)
        return () => clearInterval(interval.current)
    }, [capture, timeout, playback, stream])

    return (
        <GbCamContext.Provider value={{ 
            capture,
            facingUser,
            option,
            output: media.output,
            ready,
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
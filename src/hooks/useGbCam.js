import { convertPalette, gbDither } from "../helpers/dither";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { drawImage, getCanvas, getCanvasImage, loadImage, loadVideo } from "../helpers/canvas";

import fontface from "../assets/fonts/Rounded_5x5.ttf";
import { variations } from "../constants/colors";

const DIMENSIONS = { width: 160, height: 144, sw: 128, sh: 112, sx: 16, sy: 16 };
const DEFAULT_SETTINGS = { brightness: 51, contrast: 51, frame: 0, flip: 0, fps: 60, ratio: 0.6, variation: 0 }
const MAX_VALUE = { brightness: 255, contrast: 255, frame: 17, flip: 2 , fps: 60, ratio: 2, variation: variations.length - 1 }
const INCREMENTS = { brightness: 17, contrast: 17, frame: 1, flip: 1, fps: 1, ratio: 0.2, variation: 1 }

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
    const [ portrait, setPortrait ] = useState(false);
    const [ capture, setCapture ] = useState(null);
    const [ media, setMedia ] = useState({ source: null, output: null });
    const [ palette, setPalette ] = useState(localStorage.getItem("palette") || 0);
    const [ multiplier, setMultiplier] = useState(localStorage.getItem("multiplier") || 1);
    const [ animation, setAnimation ] = useState(Date.now());
          
    const { brightness, contrast, frame, flip, fps, ratio, variation } = settings 
    const { width, height, sx, sy, sw, sh } = DIMENSIONS;

    const player = useRef(null);     
    const recorder = useRef(null);     

    const ready = useMemo(() => media.output !== null, [media]);    
    const context = useMemo(() => {
       return media.output ? media.output.getContext("2d", {   
            desynchronized: true,
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
                width: portrait ? sh : sw,
                height: portrait ? sw : sh
            },
            audio: false
        }
    }, [facingUser, portrait, fps, sw, sh])

    const offsets = useMemo(() => {
        let x = 0;
        let y = 0;

        if(option === 1) y = sy;
        if(option === 3) y = -sy;
        if(option === 4) x = sx;

        return { x, y }
    }, [option, sx, sy])

    const clear = () => {
        setCapture(null);
    }

    const init = useCallback(async () => {
        const media = await navigator.mediaDevices.getUserMedia(sourceOptions);
        const font = await (new FontFace("Rounded_5x5", `url(${fontface})`)).load();
        const video = await loadVideo(media);
        const { canvas } = getCanvas(width, height);
        
        document.fonts.add(font);

        setMedia({source: video, output: canvas})
    }, [height, sourceOptions, width]);

    const drawUI = useCallback(() => {   
        const w = width + Math.abs(offsets.x);
        const h = height + Math.abs(offsets.y);
        const { canvas, ctx } = getCanvas(w, h, { willReadFrequently: true });
        const dPos = [9, 36, 66, 90, 114, 138];
        const uPos = [33, 73, 113];

        switch(option){
            case 0: // Options menu
                drawImage(`assets/ui/ui-options.svg`, ctx, 0, 0, width, height);                   
                if(Date.now() - animation >= 500) drawImage(`assets/ui/ui-arrows.svg`, ctx, 0, 0, width, height);
                if(Date.now() - animation >= 1000) setAnimation(Date.now());
                break;
            case 1: // Flip
                drawImage(`assets/ui/ui-options.svg`, ctx, 0, Math.abs(offsets.y), width, height)
                drawImage(`assets/ui/ui-flip.svg`, ctx, 0, 0, width, Math.abs(offsets.y));                
                drawImage(`assets/ui/ui-up.svg`, ctx, uPos[flip], 9, 16, 16);
                break;
            case 2: // Frame    
                drawImage(`assets/ui/ui-frame.svg`, ctx, 0, 0, width, height);                           
                drawImage(`assets/frames/frame-${frame}.svg`, ctx, 0, 0, width, height);
                ctx.font = `24px Rounded_5x5`;                
                ctx.fillStyle = "#000000";
                ctx.fillText(`${frame < 10 ? '0' : ''}${frame + 1}`, 81, 88);
                break;
            case 3: // Palette
                drawImage(`assets/ui/ui-options.svg`, ctx, 0, 0, width, height)
                drawImage(`assets/ui/ui-palette.svg`, ctx, 0, height, width, Math.abs(offsets.y));                
                drawImage(`assets/ui/ui-down.svg`, ctx, dPos[variation], height - 8, 16, 16);
                break;
            case 4: // Dither
                drawImage(`assets/ui/ui-options.svg`, ctx, offsets.x, 0, width, height);
                drawImage(`assets/ui/ui-dither.svg`, ctx, 0, 0, Math.abs(offsets.x), height);
                ctx.fillStyle = "#000000";                
                ctx.fillRect(9, 113 - 82 * ratio / 2, 5, 1);
                break;
            default: // Brightness / Contrast or Save 
                if(capture){
                    let vx = 0;
                    let vy = 0;
                    
                    if(Date.now() - animation >= 64){
                        setAnimation(Date.now());
                        vx = Math.floor(Math.random() * 8) * Math.random() > 0.5 ? -1 : 1;
                        vy = Math.floor(Math.random() * 8) * Math.random() > 0.5 ? -1 : 1;
                    }
                    drawImage(`assets/ui/ui-save.svg`, ctx, vx, vy, width, height);
                }else{  
                    drawImage(`assets/ui/ui-default.svg`, ctx, 0, 0, width, height)
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(30 + 101 * contrast / 255, height - 13, 1, 5);
                    ctx.fillRect(width - 13, 113 - 82 * brightness / 255, 5, 1);
                }
        }

        return canvas;
    }, [width, offsets.x, offsets.y, height, option, flip, frame, variation, ratio, capture, contrast, brightness, animation])

    const drawVideo = useCallback(() => {
        const { canvas, ctx } = getCanvas(sw, sh, { willReadFrequently: true });
        const tw = flip === 1 ? sw : 0;
        const th = flip === 2 ? sh : 0;
        const tx = flip === 1 ? -1 : 1;
        const ty = flip === 2 ? -1 : 1;
        const sx = ( Math.max(media.source.videoWidth, media.source.videoHeight)  - sw ) / 2;
        const sy = ( Math.min(media.source.videoWidth, media.source.videoHeight) - sh ) / 2;

        ctx.save();
        ctx.translate(tw, th);
        ctx.scale(tx, ty);
        ctx.drawImage(media.source, sx, sy, sw, sh);
        ctx.restore();

        const imgData = ctx.getImageData(0, 0, sw, sh);
        const dithered = gbDither(imgData, brightness, contrast, ratio);

        ctx.putImageData(dithered, 0, 0);

        return canvas;
    }, [sw, sh, flip, media.source, brightness, contrast, ratio])

    const swapPalette = (canvas, palette, variation = 0) => {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);  
        const converted = convertPalette(imgData, palette, variation);
        
        ctx.putImageData(converted, 0, 0);  

        return canvas;
    }

    const record = async (save = false) => {
        if(save && recorder.current) recorder.current.stop(); 

        const { canvas, ctx } = getCanvas(width * multiplier, height * multiplier, { willReadFrequently: true } ); 
        const fr = await getCanvasImage(`assets/frames/frame-${frame}.svg`, width * multiplier, height * multiplier);
        
        const requestFrame = () => {
            let img = drawVideo();
            img = swapPalette(img, palette, variation);
            ctx.drawImage(img, sx * multiplier, sy * multiplier, sw * multiplier, sh * multiplier);
            return requestAnimationFrame(requestFrame);
        }
        
        swapPalette(fr, palette);
        ctx.drawImage(fr, 0, 0, width * multiplier, height * multiplier);

        const frameRequest = requestFrame();

        let chunks = [];
        const stream = canvas.captureStream(60);

        recorder.current = new MediaRecorder(stream);
        recorder.current.ondataavailable = (e) => chunks.push(e.data);
        recorder.current.onstop = () => {
            let blob = new Blob(chunks, { 'type' : 'video/mp4' });
            
            setCapture(blob);
            cancelAnimationFrame(frameRequest);
            recorder.current = null;
        }

        recorder.current.start();
    }

    const snapshot = async () => {
        const { canvas, ctx } = getCanvas(width * multiplier, height * multiplier); 
        let img = drawVideo();        
        let fr = await getCanvasImage(`assets/frames/frame-${frame}.svg`, width * multiplier, height * multiplier);
        
        img = swapPalette(img, palette, variation);
        fr = swapPalette(fr, palette);

        ctx.drawImage(img, sx * multiplier, sy * multiplier, sw * multiplier, sh * multiplier)
        ctx.drawImage(fr, 0, 0, width * multiplier, height * multiplier);

        setCapture(canvas.toDataURL('image/png'));
    }

    const playback = useCallback(async () => {
        if(!player.current){
            setOption(null);
            player.current = capture instanceof Blob ? await loadVideo(capture) : await loadImage(capture);
        }

        let ui = drawUI();
        
        ui = swapPalette(ui, palette);

        context.drawImage(player.current, 0, 0, width * multiplier, height * multiplier, 0, 0, width, height);
        context.drawImage(ui, 0, 0, width, height);
    }, [capture, context, drawUI, height, multiplier, palette, width])

    const stream = useCallback(() => {
        if(!context) return;
        const uiw = width + Math.abs(offsets.x);
        const uih = height + Math.abs(offsets.y);

        let ui = drawUI();        
        let video = drawVideo();

        video = swapPalette(video, palette, variation);
        ui = swapPalette(ui, palette);
        
        context.drawImage(video, sx + offsets.x, sy + offsets.y, sw, sh);
        context.drawImage(ui, 0, 0 + offsets.y < 0 && offsets.y, uiw, uih);
    }, [context, drawUI, drawVideo, height, offsets, palette, sh, sw, sx, sy, variation, width])

    useEffect(() => { init() }, [init])

    useEffect(() => {        
        const checkPortrait = (e) => setPortrait(e.matches);
        setPortrait(window.matchMedia("(orientation: portrait)").matches);
        window.matchMedia("(orientation: portrait)").addEventListener("change", checkPortrait);
        return () => window.matchMedia("(orientation: portrait)").removeEventListener("change", checkPortrait);
    }, [])

    useEffect(() => { 
        let frameRequest;
        
        const draw = () => {
            capture ? playback() : stream();
            frameRequest = requestAnimationFrame(draw);
        }

        if(!capture){ player.current = null }

        cancelAnimationFrame(frameRequest)
        draw();
        
        return () => cancelAnimationFrame(frameRequest)
    }, [capture, playback, stream])

    return (
        <GbCamContext.Provider value={{ 
            capture,
            facingUser,
            multiplier,
            option,
            output: media.output,
            palette,
            ready,
            clear,
            setFacingUser,
            setMultiplier,
            setOption,
            setPalette,
            setting,
            snapshot, 
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
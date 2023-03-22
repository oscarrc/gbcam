import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { gbDither, convertPalette } from "../helpers/dither";
import fontface from "../assets/fonts/Rounded_5x5.ttf";

const CameraContext = createContext();
// https://github.com/NielsLeenheer/CanvasDither

const CameraReducer = (state, action) => ({ ...state, [action.type]: action.payload })

const CameraProvider = ({ children }) => {
    const output = useRef(null);

    const [facingUser, setFacingUser] = useState(true);
    const [snapshot, setSnapshot] = useState(null);
    const [recording, setRecording] = useState(null);
    const [palette, setPalette] = useState(0);
    const [state, dispatch] = useReducer(CameraReducer, { brightness: 51, contrast: 51, ratio: 0.6, negative: false });

    const capture = {
        save(){
            let a = document.createElement("a");
            a.href = snapshot ? snapshot : URL.createObjectURL(recording);        
            a.download = `${Date.now()}.${snapshot ? "png" : "mp4"}`;
            a.click();
        },    
        clear(){
            if(snapshot) setSnapshot(null);
            if(recording) setRecording(null);
        }
    }

    const dimensions = useMemo(() => (
        {
            width: 160,
            height: 144,
            vWidth: 128,
            vHeight: 112,
            vx: 16,
            vy: 16
        }
    ), [])

    const feed = useMemo(() => (
        {
            ref: null,
            itl: null,
            ctx: null,
            init(){
                this.ref = document.createElement("canvas");
                this.ref.width = dimensions.width;
                this.ref.width = dimensions.height;
    
                this.context = this.ref?.getContext("2d", { 
                    willReadFrequently: true,            
                    msImageSmoothingEnabled: false,
                    mozImageSmoothingEnabled: false,
                    webkitImageSmoothingEnabled: false,
                    imageSmoothingEnabled: false
                });
    
                clearInterval(this.itl);
            },
            draw(source, options, dither){
                const { vx, vy, vw, vh } = dimensions;  
                const { brightness, contrast, ratio, negative } = options;
                this.ctx.drawImage(source, 0, 0, vw, vh, vx, vy, vw, vh);
                
                if(!dither) return;

                const imgData = this.ctx.getImageData(vx, vy, vw, vh);            
                const dithered = gbDither(imgData, brightness, contrast, ratio, negative);    
                this.ctx.putImageData(dithered, vx, vy, 0, 0, vw, vh);
            },
            palette(palette){
                const { width, height } = dimensions;  
                const imgData = this.ctx.getImageData(0,0,width,height);
                const swapped = convertPalette(imgData, palette);
    
                this.ctx.putImageData(swapped, 0, 0);
            },
            capture: {
                ref: null,
                async snapshot(frame){
                    this.ref = feed.ref;

                    const ctx = this.ref.getContext("2d");
                    const { width, height } = dimensions;

                    const img = document.createElement("img");
                    img.src = `assets/frames/frame-${frame}.svg`;

                    img.onload = () => {                        
                        ctx.drawImage(img, 0, 0, width, height);
                        setSnapshot(this.ref.toDataURL('image/png') );
                    }
                },
                recording: {
                    recorder: null,
                    itl: null,
                    start(frame){                        
                        this.ref = feed.ref;

                        const ctx = this.ref.getContext("2d");
                        const { width, height, vx, vy, vWidth, vHeight } = dimensions;

                        const img = document.createElement("img");
                        img.src = `assets/frames/frame-${frame}.svg`;
                        
                        img.onload = () => {
                            ctx.drawImage(img, 0, 0, width, height);

                            this.itl = setInterval(async () => {
                                ctx.drawImage(feed.ref, vx, vy, vWidth, vHeight, vx, vy, vWidth, vHeight);
                            }, 17);
                        }
                        
                        let chunks = [];
                        const stream = this.ref.captureStream(60);
                        
                        this.recorder = new MediaRecorder(stream);
                        this.recorder.ondataavailable = (e) => chunks.push(e.data);
                        this.recorder.onstop = () => {
                            let blob = new Blob(chunks, { 'type' : 'video/mp4' });
                            clearInterval(this.itl);
                            setRecording(blob);
                            this.recorder = null;
                        }

                        this.recorder.start();
                    },
                    stop(){
                        this.recorder && this.recorder.stop()
                    }
                }
            }
        }
    ), [dimensions])

    const ui = {
        mode: 0,
        option: 0,
        frame: 0,
        draw: {
            frame(ctx){
                const { width, height } = dimensions;
                const img = document.createElement("img");
                img.src = `assets/frames/frame-${ui.frame}.svg`;
                
                ctx.drawImage(img, 0, 0, width, height);
            },
            controls(ctx, options){
                const { width, height } = dimensions;
                const { contrast, brightness } = options;
                const img = document.createElement("img");
                img.src = `assets/ui/controls.svg`;

                ctx.fillStyle = "white";
                ctx.drawImage(img, 0, 0, width, height);

                ctx.fillRect(30 + 101 * contrast / 255, height - 13, 1, 5);                
                ctx.fillRect(width - 13, 113 - 83 * brightness / 255 , 5, 1);
            },
            options(ctx){
                const img = document.createElement("img");                
                const { width, height } = dimensions;

                switch(ui.option){
                    case 1:
                        break;
                    case 2:
                        img.src = `assets/frames/frame-${ui.frame}.svg`;
                        ctx.drawImage(img, 0, 0, width, height);

                        img.src = `assets/ui/frames.svg`;
                        ctx.font = `24px Rounded_5x5`;

                        ctx.drawImage(img, 0, 0, width, height);
                        ctx.fillText(`${ui.frame < 10 ? '0' : ''}${ui.frame}`, 81, 88);
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    default:                        
                        img.src = `assets/ui/options.svg`;
                        ctx.drawImage(img, 0, 0, width, height);
                }
            }
        }
    }

    const video = useMemo(() => (
        {
            ref: null,
            async init(facingUser){
                try {
                    const { vWidth, vHeight } = dimensions;                
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: facingUser ? 'user' : 'environment',
                            frameRate: { ideal: 60 },
                            resizeMode: "crop-and-scale",
                            width: vWidth,
                            height: vHeight
                        }
                    });
        
                    this.ref = document.createElement("video");
                    this.ref.srcObject = stream;
                    this.ref.play();
                } catch(err) { console.error(err) }
            },
            toggle(){ this.user = !this.user }
        }
    ), [dimensions])    

    const init = useCallback(async () => {
        const fontFace = new FontFace("Rounded_5x5", `url(${fontface})`);

        if(!document.fonts.check(fontFace)){
            const font = await fontFace.load();
            await document.fonts.add(font);
        }
        
        await video.init(facingUser);

        feed.init();
    }, [facingUser, feed, video])

    useEffect(() =>  init(), [init])

    return (
        <CameraContext.Provider value={{}}>
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
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { similarColor } from "../helpers/colors";

const CameraContext = createContext();

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const recorder = useRef(null);
    const player = useRef(null);
    const dSize = 1024;
    const sSize = 128;
    const offset = 60;

    const isRecording = useMemo(() => recorder.current !== null, [recorder]);
    const [ cameraError, setCameraError ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(false);
    const [ contrast, setContrast] = useState(0);
    const [ brightness, setBrightness] = useState(0);
    const [ snapshot, setSnapshot ] = useState(null);  
    const [ recording, setRecording ] = useState(null);
    const [ selfie, setSelfie ] = useState(true);
    const [constraints] = useState(navigator.mediaDevices.getSupportedConstraints());
    
    const applyBrightness = useCallback((context) => {
        context.globalCompositeOperation = "lighten";
        context.globalAlpha = brightness; // 0-1
        context.fillStyle = "white";
        context.fillRect(0,0,output.current.width,output.current.height);            
        context.globalCompositeOperation = "copy";
        context.globalAlpha = 1; 
    }, [brightness]);

    const applyContrast = useCallback((context) => {
        context.globalCompositeOperation = "saturation";
        context.globalAlpha = contrast; // 0-1
        context.fillStyle = "red";
        context.fillRect(0,0,output.current.width,output.current.height);
        context.globalCompositeOperation = "copy";
        context.globalAlpha = 1; 
    }, [contrast]);

    const convertPalette = (context) => {
        const palette = [[34, 73, 57], [54, 119, 74], [77, 163, 80], [132, 205, 110]];
        const width = output.current.width;
        const height = output.current.height;
        const imgData = context.getImageData(0,0,width,height);
        
        for (let y = 0; y < imgData.height; y++) {
          for (let x = 0; x < imgData.width; x++) {
            let i = y * 4 * imgData.width + x * 4;
            const color = similarColor([ imgData.data[i], imgData.data[i + 1], imgData.data[i + 2] ], palette);
            
            imgData.data[i] = color[0];
            imgData.data[i + 1] = color[1];
            imgData.data[i + 2] = color[2];
          }
        }

        context.putImageData(imgData, 0, 0);
    }

    const initVideo = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: selfie ? 'user' : 'environment',
                    frameRate: { ideal: 60 },
                    resizeMode: 'crop-and-scale',
                    width: { exact: sSize },
                    height: { exact: sSize },
                    advanced: [{
                        contrast: 100
                    }]
                }
            });

            console.log(stream.getTracks()[0].getSettings())

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

    const drawControls = (context) => {
        const cw = context.measureText("CONTRAST").width;
        const cx = ( output.current?.width - cw) / 2;
        const cy = ( output.current?.height - 5);
        const bw = context.measureText("BRIGHTNESS").width;
        const bx = ( output.current?.width - 5);
        const by = ( output.current?.height - bw) / 2;
        const angle = (90 * Math.PI) / 180;

        context.globalCompositeOperation = "source-over";
        context.fillStyle = "#84cd6e";
        context.strokeStyle = "#84cd6e";
        context.lineWidth = 2;
        context.font = "12px monospace";
        
        context.beginPath();
        context.moveTo(offset, cy - 2)
        context.lineTo(cx - 5 , cy - 2);
        context.moveTo(cx + cw + 5, cy - 2);
        context.lineTo(output.current?.width - offset , cy - 2);
        context.moveTo(bx - 2, offset);
        context.lineTo(bx - 2 , by - 5);
        context.moveTo(bx - 2, by + bw + 5);
        context.lineTo(bx - 2 , output.current?.height - offset);
        context.stroke();
        
        context.beginPath();
        context.moveTo(offset*0.5, cy - 10);
        context.lineTo(offset*0.75, cy - 2);
        context.lineTo(offset - 5, cy - 2);
        context.lineTo(offset - 5, cy - 18);        
        context.lineTo(offset*0.75, cy - 18);
        context.lineTo(offset*0.5, cy - 10);
        context.stroke();

        context.beginPath();
        context.moveTo(output.current?.width - offset*0.5, cy - 10);
        context.lineTo(output.current?.width - offset*0.75, cy - 2);
        context.lineTo(output.current?.width - offset + 5, cy - 2);
        context.lineTo(output.current?.width - offset + 5, cy - 18);        
        context.lineTo(output.current?.width - offset*0.75, cy - 18);
        context.lineTo(output.current?.width - offset*0.5, cy - 10);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(bx - 10, offset*0.5);
        context.lineTo(bx - 2, offset*0.75);
        context.lineTo(bx - 2, offset - 5);
        context.lineTo(bx - 18, offset - 5);        
        context.lineTo(bx - 18, offset*0.75);
        context.lineTo(bx - 10, offset*0.5);
        context.stroke();

        context.beginPath();
        context.moveTo(bx - 10, output.current?.width - offset*0.5);
        context.lineTo(bx - 2, output.current?.width - offset*0.75);
        context.lineTo(bx - 2, output.current?.width - offset + 5);
        context.lineTo(bx - 18, output.current?.width - offset + 5);
        context.lineTo(bx - 18, output.current?.width - offset*0.75);
        context.lineTo(bx - 10, output.current?.width - offset*0.5);
        context.fill();
        context.stroke();

        context.fillText("CONTRAST", cx, cy);

        context.translate(bx - 8, by)
        context.rotate(angle);
        context.fillText("BRIGHTNESS", angle, 0); 
        context.setTransform(1,0,0,1,0,0);
    }

    const drawFrame = (context) => {

    }

    const drawVideoFeed = useCallback((context) => {
        if(!video.current) return;
        
        const d = Math.min(output.current?.width, output.current?.height) - offset;
        const sx = ( output.current?.width - video.current?.videoWidth ) / 2;
        const sy = ( output.current?.height - video.current?.videoHeight ) / 2;
        const dx = ( output.current?.width - d ) / 2;
        const dy = ( output.current?.height - d ) / 2;

        context.drawImage(video.current, sx, sy);

        applyContrast(context);
        applyBrightness(context);
        convertPalette(context);

        context.drawImage(output.current, sx, sy, sSize, sSize, dx, dy, d, d);
    }, [applyBrightness, applyContrast]);

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

        if(snapshot){ 
            drawSnapshot(context);
            drawFrame(context)
        }else if(recording) {
            drawInterval.current = setInterval(() => { 
                drawRecording(context);
                drawFrame(context);
            }, 17)
        }else{
            drawInterval.current = setInterval(() => { 
                drawVideoFeed(context);
                drawControls(context);
            }, 17 )
        }
    }, [drawSnapshot, drawRecording, drawVideoFeed, recording, snapshot])

    const takeSnapshot = () => {
        const c = document.createElement("canvas");
        const context = c.getContext("2d");
        c.width = dSize;
        c.height = dSize;
        context.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, dSize, dSize);
        setSnapshot(c.toDataURL('image/png'))
    }

    const saveSnapshot = () => {
        if(!snapshot) return;
        let a = document.createElement("a");
        a.href = snapshot;
        a.download = `${Date.now()}.png`;
        a.click();
    }

    const clearSnapshot = () => setSnapshot(null);

    const startRecording = () => {
        const c = document.createElement("canvas");
        const context = c.getContext("2d");
        
        c.width = dSize;
        c.height = dSize;

        let interval = setInterval(() => {
            context.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, dSize, dSize);
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

    const saveRecording = () => {
        if(!recording) return;
        let a = document.createElement("a");
        a.href = URL.createObjectURL(recording); 
        a.download = `${Date.now()}.mp4`;
        a.click();
    }

    const clearRecording = () => {
        setRecording(null);
        if(player.current) player.current = null;
        if(recorder.current) recorder.current = null;
    }

    const save = () => {
        if(snapshot) saveSnapshot();
        if(recording) saveRecording();
    }

    const clear = () => {
        if(snapshot) clearSnapshot();
        if(recording) clearRecording();
    }

    const flipCamera = () => setSelfie(s => !s);

    useEffect(() => { initVideo() }, [initVideo])

    return (
        <CameraContext.Provider 
            value={{ 
                clear,
                initCamera, 
                flipCamera,
                save,
                setBrightness, 
                setContrast,
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
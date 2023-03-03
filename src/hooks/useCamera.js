import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { similarColor } from "../helpers/colors";

const CameraContext = createContext();

const CameraProvider = ({ children }) => {
    const video = useRef(null);
    const output = useRef(null);
    const drawInterval = useRef(null);
    const recorder = useRef(null);
    const player = useRef(null);
    const oSize = 1024;
    const rSize = 128;

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
                    facingMode: selfie ? 'user' : 'environment'
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
    }, [selfie])

    const drawVideoFeed = useCallback((context) => {
        drawInterval.current = setInterval(() => {
            if(!video.current) return;
            
            const sMin = Math.min(video.current?.videoWidth, video.current?.videoHeight);
            const dMin = Math.min(output.current?.width, output.current?.height);
            const sx = ( video.current.videoWidth - sMin ) / 2;
            const sy = ( video.current.videoHeight - sMin ) / 2;

            context.drawImage(video.current, sx, sy, sMin, sMin, 0, 0, rSize, rSize);
            
            applyContrast(context);
            applyBrightness(context);
            convertPalette(context);

            context.drawImage(output.current, 0, 0, rSize, rSize, 0, 0, dMin, dMin);         
        },17)
    }, [applyBrightness, applyContrast])

    const drawSnapshot = useCallback((context) => {
        const dMin = Math.min(output.current?.width, output.current?.height);
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, oSize, oSize, 0, 0, dMin, dMin); 
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
        
        drawInterval.current = setInterval(() => {
            context.drawImage(player.current, 0, 0, oSize, oSize, 0, 0, dMin, dMin);
        }, 17);        
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

        if(snapshot) drawSnapshot(context);
        else if(recording) drawRecording(context);
        else drawVideoFeed(context);
    }, [drawSnapshot, drawRecording, drawVideoFeed, recording, snapshot])

    const takeSnapshot = () => {
        const c = document.createElement("canvas");
        const context = c.getContext("2d");
        c.width = oSize;
        c.height = oSize;
        context.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, oSize, oSize);
        c.toBlob((b) => { setSnapshot(b) }, 'image/png');
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
        
        c.width = oSize;
        c.height = oSize;

        let interval = setInterval(() => {  
            context.drawImage(output.current, 0, 0, output.current.width, output.current.height, 0, 0, oSize, oSize);
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

    const flipCamera = () => {
        setSelfie(s => !s);
    }

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
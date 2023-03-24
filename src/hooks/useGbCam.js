import { convertPalette, gbDither } from "../helpers/dither";
import { palettes, variations } from "../constants/colors";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

const gbCamReducer = (state, action) => {
    const { option, value } = action;

    let parsed;

    switch(option){
        case "brightness":
            parsed = value > 0 && state.brightess < 254 ? state.brightness + 1 : state.brightness > 0 ? state.brightness -1 : 0
            break;
        case "contrast":
            parsed = value > 0 && state.brightess < 254 ? state.brightness + 1 : state.brightness > 0 ? state.brightness -1 : 0
            break;
        case "palette":            
            parsed = value >= 0 && value < palettes.length ? value : state.palette;
            break;
        case "ratio":
            parsed = value > 0 && state.brightess <= 4 ? state.ratio + .1 : state.ratio > 0 ? state.ratio -.1 : 0
            break;
        case "variation":            
            parsed = value >= 0 && value < variations.length ? value : state.variation;
            break;
        default:
            return state;
    }

    return { ...state, [option]: parsed }
}

const useGbCam = ({ video, fps }) => {    
    const gbcam = useRef(null);
    const interval = useRef(null);

    const timeout = useMemo(() => 1000 / fps, [fps]);
    const context = useMemo(() => {
        if(!gbcam.current) return null;

        return gbcam.current.getContext("2d", { 
            willReadFrequently: true,            
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });
    }, [gbcam])
    
    const [ options, setOption ] = useReducer(gbCamReducer, { brightness:51, contrast: 51, palette: 0, ratio: 0.6, variation: 0 });

    const init = useCallback(() => {        
        if(!video) return;

        const { width, height } = video;

        gbcam.current = document.createElement("canvas")
        gbcam.current.width = width;
        gbcam.current.height = height;
    }, [video])

    const stream = useCallback(() => {
        if(!gbcam.current) return;
        
        const { width, height } = video;
        const { brightness, contrast, palette, ratio, variation } = options;

        interval.current = setInterval(() => {
            context.drawImage(video, 0, 0, width, height);

            const imgData = context.getImageData(0, 0, width, height);
            const dithered = gbDither(imgData, brightness, contrast, ratio);
            const converted = convertPalette(dithered, palette, variation);

            context.putImageData(converted, 0, 0);
        }, timeout)
    }, [context, options, timeout, video])

    useEffect(() => { init() }, [init]);
    useEffect(() => { 
        stream()
        return () => clearInterval(interval.current)
     }, [stream])

    return {
        gbcam,
        options,
        setOption
    }
}

export { useGbCam }
import { useCallback, useEffect, useMemo, useRef } from "react";

const useGbUI = (width, height, option, value) => {
    const ui = useRef(null);
    
    const context = useMemo(() => {
        return ui.current.getContext("2d", { 
            imageSmoothingEnabled: false
        });
    }, [ui])

    const init = useCallback(() => {
        ui.current = document.createElement("canvas");
        ui.current.width = width;
        ui.current.height = height;
    }, [width, height]);

    const draw = useCallback(() => {
        if(!ui.current) return;
        if(!option || !value) return;

        switch(option){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            default:
                return;
        }
    }, [option, value])
    
    useEffect(() => init(), [init])
    useEffect(() => draw(), [draw])
}
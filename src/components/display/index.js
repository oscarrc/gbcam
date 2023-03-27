import { useEffect, useRef } from "react";

import { AiFillHeart } from "react-icons/ai";
import { useGbCam } from "../../hooks/useGbCam";

const Display = ({ className }) => {
    const { output, ready } = useGbCam();
    const display = useRef(null);
    const interval = useRef(null);

    useEffect(() => {
        const canvas = display.current;
        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.height = height;
            canvas.width = width;
        };
        
        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        return () => window.removeEventListener("resize", setCanvasSize);
    }, [display])

    useEffect(() => {
        if(!ready || !display.current) return;
        
        const ctx = display.current.getContext("2d", {     
            msImageSmoothingEnabled: false,
            mozImageSmoothingEnabled: false,
            webkitImageSmoothingEnabled: false,
            imageSmoothingEnabled: false
        });

        interval.current = setInterval(async () => {            
            ctx.drawImage(output.current, 0, 0, display.current.width, display.current.height);
        }, 17);

        return () => clearInterval(interval.current);
    }, [ready, output, display])
   
    return (
        <div className={`aspect-4/3 ${className} bg-base-100 rounded-lg rounded-br-[2rem] flex flex-col gap-2 py-2`}>
            <div className="flex flex-row items-center gap-4 px-4 py-0 sm:py-1">
                <span className="flex-1 h-2 border-y-2 border-t-line-1 border-b-line-2"></span>
                <a href="https://oscarrc.me" target="_BLANK" rel="noreferrer noopener" className="text-white text-xs sm:text-sm">Made with <AiFillHeart className="inline h-3 w-3" /> by Oscar R.C.</a>               
                <span className="h-2 min-w-[10%] border-y-2 border-t-line-1 border-b-line-2"></span>
            </div>
            <div className="flex flex-row items-start justify-center pb-6 sm:pb-10 px-12 sm:px-16 pt-1 relative">
                <div className="flex flex-col items-center justify-center gap-2 w-12 sm:w-16 absolute left-0 top-[25%]">
                    <span className={`h-2 w-2 bg-red rounded-full ${ready ? 'glow' : 'bg-opacity-20'}`}></span>
                    <span className="text-white text-2xs sm:text-xs relative -bottom-px">Camera</span>
                </div>
                <div className="relative">
                    <canvas ref={display} className="bg-display w-full aspect-10/9" />
                </div>
            </div>
        </div>
    )
}

export default Display;
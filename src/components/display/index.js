import { BsCaretLeft, BsCaretRightFill } from "react-icons/bs"
import { useEffect, useRef, useState } from "react";

import { AiFillHeart } from "react-icons/ai";
import { useCamera } from "../../hooks/useCamera";

const Display = ({ className }) => {
    const { output, isRecording, initCamera, cameraEnabled, brightness, contrast} = useCamera();
    const [showControls, setShowControls] = useState(true);
    const controlsTimeout = useRef(null);

    useEffect(() => {
        const canvas = output.current;
        const setCanvasHeight = () => canvas.height = canvas.width;
        
        setCanvasHeight();
        window.addEventListener("resize", setCanvasHeight)

        return () => window.removeEventListener("resize", setCanvasHeight)
    }, [output])

    useEffect(()=> {
        if(!output.current) return;
        initCamera()
    },[initCamera, output])

    useEffect(() => {
        let timeout = controlsTimeout.current;
        setShowControls(true);
        timeout = setTimeout(() => setShowControls(false), 2000);

        return () => clearTimeout(timeout)
    }, [ brightness, contrast ])

    return (
        <div className={`aspect-4/3 ${className} bg-base-100 rounded-lg rounded-br-[2rem] flex flex-col gap-2 py-2`}>
            <div className="flex flex-row items-center gap-4 px-4">
                <span className="flex-1 h-2 border-y-2 border-t-line-1 border-b-line-2"></span>
                <a href="https://oscarrc.me" target="_BLANK" rel="noreferrer noopener" className="text-white text-xs sm:text-sm">Made with <AiFillHeart className="inline h-3 w-3" /> by Oscar R.C.</a>               
                <span className="h-2 min-w-[10%] border-y-2 border-t-line-1 border-b-line-2"></span>
            </div>
            <div className="flex flex-row items-start justify-center pb-6 sm:pb-10 px-12 sm:px-16 pt-1 sm:pt-4 relative">
                <div className="flex flex-col items-center justify-center gap-2 w-12 sm:w-16 absolute left-0 top-[25%]">
                    <span className={`h-2 w-2 bg-red rounded-full ${cameraEnabled ? 'glow' : 'bg-opacity-20'}`}></span>
                    <span className="text-white text-2xs sm:text-xs relative -bottom-px">Camera</span>
                </div>
                <div className="relative">      
                    {
                        cameraEnabled &&
                            <>
                                <div className={`range-custom absolute py-1 px-8 bottom-0 left-0 w-full text-primary transition-all duration-200 ${!showControls && 'opacity-0'}`}>
                                    <BsCaretLeft />
                                    <label className="font-display" htmlFor="contrast">
                                        <span className="px-1">contrast</span>
                                    </label>                        
                                    <input type="range" aria-label="contrast" aria-readonly="true" id="contrast" readOnly={true} min="0" max="100" value={ contrast * 100 } />
                                    <BsCaretRightFill />
                                </div>
                                <div className={`range-custom range-vertical absolute py-1 px-4 -rotate-90 origin-top-right top-0 right-6 text-primary transition-all duration-200 ${!showControls && 'opacity-0'}`}>
                                    <BsCaretLeft />
                                    <label className="font-display" htmlFor="brightness">
                                        <span className="px-1">brightness</span>
                                    </label>
                                    <input type="range" aria-label="brightness" aria-readonly="true" id="brightness" readOnly={true} min="0" max="100" value={ brightness * 100 } />
                                    <BsCaretRightFill />
                                </div>
                            </>
                    }
                    { isRecording && <span className="h-2 w-2 bg-base-100 absolute bottom-2 right-2 rounded-full animate-pulse"></span> }
                    <canvas ref={output} className="bg-display w-full aspect-10/9" />
                </div>
            </div>
        </div>
    )
}

export default Display;
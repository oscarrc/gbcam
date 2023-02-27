import { BsCaretDown, BsCaretLeft, BsCaretRightFill, BsCaretUpFill } from "react-icons/bs"

import { AiFillHeart } from "react-icons/ai";
import { useCamera } from "../../hooks/useCamera";
import { useEffect } from "react";

const Display = ({ className }) => {
    const { output, initFeed, cameraEnabled } = useCamera();

    useEffect(() => {
        const canvas = output.current;
        const setCanvasHeight = () => canvas.height = canvas.width;
        
        setCanvasHeight();
        window.addEventListener("resize", setCanvasHeight)

        return () => window.removeEventListener("resize", setCanvasHeight)
    }, [output])

    useEffect(()=> {
        if(!output.current) return;
        initFeed()
    },[initFeed, output])

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
                    <div className="flex gap-1 absolute py-1 pl-1 pr-8 bottom-0 left-0 w-full text-primary">
                        <BsCaretLeft />
                        <input type="range" name="contrast" readOnly={true} min="0" max="100" value="40" className="range range-xs range-custom flex-1" />
                        <label className="absolute text-2xs left-0 bottom-0 pl-1 pr-8 text-center font-display w-full" htmlFor="contrast">contrast</label>
                        <BsCaretRightFill />
                    </div>
                    <canvas ref={output} className="bg-display w-full aspect-10/9" />
                </div>
            </div>
        </div>
    )
}

export default Display;
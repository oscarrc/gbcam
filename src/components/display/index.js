import { AiFillHeart } from "react-icons/ai";
import { useRef, useEffect } from "react";

const Display = ({ className }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const setCanvasHeight = () => {
            canvas.height = canvas.width
        };

        setCanvasHeight();
        window.addEventListener("resize", setCanvasHeight)

        return () => window.removeEventListener("resize", setCanvasHeight)
    }, [canvasRef])

    return (
        <div className={`aspect-4/3 ${className} bg-base-100 rounded-lg rounded-br-[2rem] flex flex-col gap-2 py-2`}>
            <div className="flex flex-row items-center gap-4 px-4">
                <span className="flex-1 h-2 border-y-2 border-t-line-1 border-b-line-2"></span>
                <p className="text-white text-sm">Made with <AiFillHeart className="inline h-3 w-3" /> by <a href="https://oscarrc.me" target="_BLANK" rel="noreferrer noopener">Oscar R.C.</a></p>                
                <span className="h-2 min-w-[10%] border-y-2 border-t-line-1 border-b-line-2"></span>
            </div>
            <div className="flex flex-row items-start justify-center pb-10 pr-20">
                <div className="flex flex-col items-center justify-center gap-2 w-20 mt-[25%]">
                    <span className="h-2 w-2 bg-red rounded-full bg-opacity-20"></span>
                    <span className="text-white text-xs relative -bottom-px">Camera</span>
                </div>
                <canvas ref={canvasRef} className="bg-display w-full">

                </canvas>
            </div>
        </div>
    )
}

export default Display;
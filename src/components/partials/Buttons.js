import { saveFile } from "../../helpers/file";
import { useGbCam } from "../../hooks/useGbCam";
import { useRef } from "react"

const Buttons = ({ className }) => {
    const { clear, option, capture, setOption, snapshot, record } = useGbCam();
    const start = useRef(0);
    const timer = useRef(null);
    const btn = useRef(null);

    const cancel = () => {
        clear();
        setOption(option > 0 ? 0 : -1)
    }

    const checkTouches = (touches) => {
        let isTouching = false;

        Object.values(touches).forEach(t => {
            let elm = document.elementFromPoint(t.pageX,t.pageY)
            if(elm === btn.current) isTouching = true;
        })

        return isTouching;
    }

    const handleStart = (e) => {
        if (capture && e.type !== "touchstart") return saveFile(capture);
        if (e.type === "touchstart" && !checkTouches(e.touches)) return;
        
        start.current = Date.now();
        timer.current = setTimeout(() => { record() }, 1000)
    }

    const handleStop = (e) => {
        if(capture) return;
        if (e.type === "touchstart" && checkTouches(e.touches)) return;

        if(Date.now() - start.current < 1000 ){
            clearTimeout(timer.current);
            snapshot();
        }else record(true);
    }

    const events = {
        onMouseDown: handleStart,
        onMouseUp: handleStop,
        onTouchStart: handleStart,
        onTouchEnd: handleStop
    }

    return (
        <div className={`grid grid-cols-2 grid-rows-2 rotate-35 text-button font-bold text-neutral-content text-xs ${className}`}>            
            <div className="text-center col-start-2  -rotate-35">
                <button ref={btn} { ...events } aria-label="Take photo or video" className="btn btn-circle shadow-lg btn-accent"></button>
                <label className="block ml-8 -rotate-35">A</label>
            </div>
            <div className="text-center row-start-2 col-start-1 -rotate-35">
                <button onClick={cancel} aria-label="Start over" className="btn btn-circle shadow-lg btn-accent"></button>
                <label className="block ml-8 -rotate-35">B</label>
            </div>
        </div>
    )
}

export default Buttons;
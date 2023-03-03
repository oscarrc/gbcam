import { BsFillCameraFill } from "react-icons/bs";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useCamera } from "../../hooks/useCamera";
import { useRef } from "react"

const Snap = () => {
    const { clear, startRecording, stopRecording, takeSnapshot, snapshot, recording } = useCamera();
    const start = useRef(0);
    const timer = useRef(null);
    const snap = useRef(null);

    const checkTouches = (touches) => {
        let isTouching = false;

        Object.values(touches).forEach(t => {
            let elm = document.elementFromPoint(t.pageX,t.pageY)
            if(elm === snap.current) isTouching = true;
        })

        return isTouching;
    }

    const handleStart = (e) => {
        if(snapshot || recording) return;
        if (e.type === "touchstart" && !checkTouches(e.touches)) return;
        
        start.current = Date.now();
        timer.current = setTimeout(() => { startRecording() }, 500)
    }

    const handleStop = (e) => {
        if(snapshot || recording) return;
        if (e.type === "touchstart" && checkTouches(e.touches)) return;

        if(Date.now() - start.current < 500 ){
            clearTimeout(timer.current);
            takeSnapshot();
        }else stopRecording();
    }

    const events = {
        onMouseDown: handleStart,
        onMouseUp: handleStop,
        onTouchStart: handleStart,
        onTouchEnd: handleStop
    }

    return (
        <div className="grid grid-cols-2 grid-rows-2 rotate-35 text-button font-bold text-neutral-content text-xs">            
            <div className="text-center col-start-2  -rotate-35">
                <button ref={snap} { ...events } aria-label="Take photo or video" className="btn btn-circle shadow-lg btn-accent">
                    <BsFillCameraFill/>
                </button>
                <label className="block ml-8 -rotate-35">A</label>
            </div>
            <div className="text-center row-start-2 col-start-1 -rotate-35">
                <button onClick={clear} aria-label="Start over" className="btn btn-circle shadow-lg btn-accent">
                    <RiArrowGoBackFill />
                </button>
                <label className="block ml-8 -rotate-35">B</label>
            </div>
        </div>
    )
}

export default Snap;
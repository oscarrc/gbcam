import { BsFillCameraFill } from "react-icons/bs";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useCamera } from "../../hooks/useCamera";
import { useRef } from "react"

const Snap = () => {
    const { clear, startRecording, stopRecording, takeSnapshot } = useCamera();
    const down = useRef(0);
    const downTimer = useRef(null);

    const handleMouseDown = () => {
        down.current = Date.now();
        downTimer.current = setTimeout(() => { startRecording() }, 500)
    }

    const handleMouseUp = () => {
        if(Date.now() - down.current < 500 ){
            clearTimeout(downTimer);
            takeSnapshot();
        }else stopRecording();
    }

    return (
        <div className="grid grid-cols-2 grid-rows-2 rotate-35 text-button font-bold text-neutral-content text-xs">            
            <div className="text-center col-start-2  -rotate-35">
                <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} aria-label="Take photo" className="btn btn-circle shadow-lg btn-accent">
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
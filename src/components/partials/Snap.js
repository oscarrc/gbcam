import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useCamera } from "../../hooks/useCamera";

const Snap = () => {
    const { takeSnapshot, clearSnapshot } = useCamera();

    return (
        <div className="grid grid-cols-2 grid-rows-2 rotate-35 text-button font-bold text-neutral-content text-xs">            
            <div className="text-center col-start-2  -rotate-35">
                <button onClick={takeSnapshot} aria-label="Take photo" className="btn btn-circle shadow-lg btn-accent">
                    <BsFillCameraFill/>
                </button>
                <label className="block ml-8 -rotate-35">A</label>
            </div>
            <div className="text-center row-start-2 col-start-1 -rotate-35">
                <button onClick={clearSnapshot} aria-label="Start over" className="btn btn-circle shadow-lg btn-accent">
                    <RiArrowGoBackFill />
                </button>
                <label className="block ml-8 -rotate-35">B</label>
            </div>
        </div>
    )
}

export default Snap;
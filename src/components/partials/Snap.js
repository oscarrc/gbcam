import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";

const Snap = () => {
    return (
        <div className="grid grid-cols-2 grid-rows-2 rotate-35 text-button font-bold text-neutral-content text-xs">            
            <div className="text-center col-start-2  -rotate-35">
                <button aria-label="Take photo" className="btn btn-circle btn-accent">
                    <BsFillCameraFill/>
                </button>
                <label className="block ml-8 -rotate-35">P</label>
            </div>
            <div className="text-center row-start-2 col-start-1 -rotate-35">
                <button aria-label="Take video" className="btn btn-circle btn-accent">
                    <BsFillCameraVideoFill/>
                </button>
                <label className="block ml-8 -rotate-35">V</label>
            </div>
        </div>
    )
}

export default Snap;
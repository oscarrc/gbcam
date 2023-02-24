import { BsFillCameraFill, BsFillCameraVideoFill } from "react-icons/bs";

const Snap = () => {
    return (
        <button aria-label="Take photo" className="btn btn-lg btn-circle btn-accent swap ">
            <BsFillCameraFill className="swap-off" />
            <BsFillCameraVideoFill className="swap-on" />
        </button>
    )
}

export default Snap;
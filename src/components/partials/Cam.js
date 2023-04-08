import { CamIcon } from "../icons";

const Cam = ({ theme, setSelfie, selfie }) => {
    const flip = () => setSelfie(u => !u);

    return (
        <button onClick={flip} aria-label="flip camera">
            <CamIcon className={`h-6 w-6 ${theme}`} selfie={ selfie }/>
        </button>
    )
}

export default Cam;
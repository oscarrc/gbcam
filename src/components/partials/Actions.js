import { dataToFile } from "../../helpers/file";
import { useGbCam } from "../../hooks/useGbCam";

const Actions = () => {
    const { setOption, capture } = useGbCam();
    
    const share = async () => {
        if(!capture){
            navigator.share({
                title: "Virtual GB Cam",
                text: "Virtual GB Cam | A Lo-Fi camera for 90s kids",
                url: window.location.href
            })
        }else{
            const file = await dataToFile(capture);
            navigator.share({ files: [file] });
        }
    }

    const toggleOptions = () => !capture && setOption(o => o === null ? 0 : null);

    return (
        <div className="actions relative grid grid-cols-2 gap-4 font-bold text-neutral-content text-xs">
            <span className="-rotate-20">
                <button onClick={share} name="Save" aria-label="Save" className="btn btn-secondary p-0 min-h-0 h-4 w-12 rounded-lg shadow"></button>
                <label htmlFor="Share" className="text-button text-center block">SHARE</label>
            </span>
            <span className="-rotate-20">
                <button onClick={toggleOptions} name="Share" aria-label="Share" className="btn btn-secondary p-0 min-h-0 h-4 w-12 rounded-lg shadow"></button>
                <label htmlFor="Select" className="text-button text-center block">SELECT</label>
            </span>
        </div>
    )
}

export default Actions;
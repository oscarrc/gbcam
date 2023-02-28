import { useCamera } from "../../hooks/useCamera";

const Mode = () => {
    const { save, recording, snapshot } = useCamera();

    const share = () => {
        const media = snapshot ? snapshot : recording;
        const extension = snapshot ? ".jpg" : ".mp4";

        if(!media) return;
        navigator.share({
            url: "https://gbCam.oscarrc.me",
            files: [
                new File([media], `${Date.now()}${extension}`)
            ]
        })
    }

    return (
        <div className="grid grid-cols-2 gap-4 font-bold text-neutral-content text-xs">
            <span className="-rotate-20">
                <button onClick={save} name="Save" aria-label="Save" className="btn btn-secondary p-0 min-h-0 h-4 w-12 rounded-lg shadow-lg"></button>
                <label htmlFor="Save" className="text-button text-center block">SAVE</label>
            </span>
            <span className="-rotate-20">
                <button onClick={share} name="Share" aria-label="Share" className="btn btn-secondary p-0 min-h-0 h-4 w-12 rounded-lg shadow-lg"></button>
                <label htmlFor="Share" className="text-button text-center block">SHARE</label>
            </span>
        </div>
    )
}

export default Mode;
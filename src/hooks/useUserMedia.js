import { useCallback, useEffect, useRef } from "react";

const useUserMedia = ({ width, height, fps, facingMode }) => {    
    const media = useRef(null);
    const video = useRef(null);

    const init = useCallback(async () => {
        media.current = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingMode ? 'user' : 'environment',
                frameRate: { ideal: fps },
                resizeMode: "crop-and-scale",
                width: width,
                height: height
            },
            audio: false
        });

        video.current = document.createElement("video");
        video.current.srcObject = video.current;
        video.current.play();
    }, [fps, height, facingMode, width])

    useEffect(() => { init(media) }, [init])

    return { video: video.current }
}

export { useUserMedia }
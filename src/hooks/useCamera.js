import { useState } from "react"

const useCamera = () => {
    const [ videoMode, setVideoMode ] = useState(false);

    return ({ videoMode, setVideoMode })
}

export { useCamera }
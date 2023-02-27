import { BsBrightnessAltLowFill, BsFillBrightnessHighFill } from "react-icons/bs"
import { RiContrast2Fill, RiContrast2Line } from "react-icons/ri";

import { useCamera } from "../../hooks/useCamera";

const Controls = () => {
    const { brightness, contrast, setBrightness, setContrast } = useCamera();

    const increaseBrightness = () => {  if(brightness < 1)  setBrightness( b => b + 0.01 ) }
    const decreaseBrightness = () => { if (brightness > 0) setBrightness( b => b - 0.01 ) }
    const increaseContrast = () => { if(contrast < 1) setContrast( c => c + 0.01 ) }
    const decreaseContrast = () => { if(contrast > 0) setContrast( c => c - 0.01 ) }
    
    return (
        <div className="grid grid-cols-3 grid-rows-3">
            <div className="relative right-[5%] bottom-[5%] rounded flex items-center justify-center w-[110%] h-[110%] bg-primary col-start-2 row-start-2">
                <span className="rounded-full bg-white bg-opacity-10 h-6 w-6 block" />
            </div>
            <button onClick={increaseBrightness} className="shadow-lg rounded-sm rounded-l-none col-start-3 row-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Up"><BsFillBrightnessHighFill /></button>
            <button onClick={decreaseBrightness} className="shadow-lg rounded-sm rounded-r-none row-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Down"><BsBrightnessAltLowFill /></button>
            <button onClick={increaseContrast} className="shadow-lg rounded-sm rounded-b-none col-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Up"><RiContrast2Fill /></button>
            <button onClick={decreaseContrast} className="shadow-lg rounded-sm rounded-t-none col-start-2 row-start-3 btn btn-primary btn-sm btn-square" aria-label="Contrast Down"><RiContrast2Line /></button>
        </div>
    )
}

export default Controls;
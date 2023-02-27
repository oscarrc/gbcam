import { BsCaretDownFill, BsCaretLeftFill, BsCaretRightFill, BsCaretUpFill } from "react-icons/bs"

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
            <button onClick={increaseBrightness} className="relative shadow-lg rounded-sm rounded-l-none col-start-3 row-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Up"><BsCaretRightFill className="opacity-50 absolute -right-4" /></button>
            <button onClick={decreaseBrightness} className="relative shadow-lg rounded-sm rounded-r-none row-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Down"><BsCaretLeftFill className="opacity-50 absolute -left-4" /></button>
            <button onClick={increaseContrast} className="relative shadow-lg rounded-sm rounded-b-none col-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Up"><BsCaretUpFill className="opacity-50 absolute -top-4" /></button>
            <button onClick={decreaseContrast} className="relative shadow-lg rounded-sm rounded-t-none col-start-2 row-start-3 btn btn-primary btn-sm btn-square" aria-label="Contrast Down"><BsCaretDownFill className="opacity-50 absolute -bottom-4" /></button>
        </div>
    )
}

export default Controls;
import { BsCaretDownFill, BsCaretLeftFill, BsCaretRightFill, BsCaretUpFill } from "react-icons/bs"

import { useCamera } from "../../hooks/useCamera";

const Controls = () => {
    const { setBrightness, setContrast, snapshot, recording } = useCamera();

    const increaseBrightness = () => { (!snapshot && !recording) && setBrightness( b => b + 0.01 > 1 ? 1 : b + 0.01 ) }
    const decreaseBrightness = () => { (!snapshot && !recording) && setBrightness( b => b - 0.01 < 0 ? 0 : b - 0.01) }
    const increaseContrast = () => { (!snapshot && !recording) && setContrast( c => c + 0.01 > 1 ? 1 : c + 0.01 ) }
    const decreaseContrast = () => { (!snapshot && !recording) && setContrast( c => c - 0.01 < 0 ? 0 : c - 0.01 ) }
    
    return (
        <div className="grid grid-cols-3 grid-rows-3">
            <div className="relative right-[5%] bottom-[5%] rounded flex items-center justify-center w-[110%] h-[110%] bg-primary col-start-2 row-start-2">
                <span className="rounded-full bg-white bg-opacity-5 h-6 w-6 block" />
            </div>
            <button onClick={increaseBrightness} className="relative shadow-lg rounded-sm rounded-b-none col-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Up"><BsCaretUpFill className="text-base-100 opacity-25 absolute -top-4" /></button>
            <button onClick={decreaseBrightness} className="relative shadow-lg rounded-sm rounded-t-none col-start-2 row-start-3 btn btn-primary btn-sm btn-square" aria-label="Brightness Down"><BsCaretDownFill className="text-base-100 opacity-25 absolute -bottom-4" /></button>
            <button onClick={increaseContrast} className="relative shadow-lg rounded-sm rounded-l-none col-start-3 row-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Up"><BsCaretRightFill className="text-base-100 opacity-25 absolute -right-4" /></button>
            <button onClick={decreaseContrast} className="relative shadow-lg rounded-sm rounded-r-none row-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Down"><BsCaretLeftFill className="text-base-100 opacity-25 absolute -left-4" /></button>
        </div>
    )
}

export default Controls;
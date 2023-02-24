import { BsBrightnessAltLowFill, BsFillBrightnessHighFill } from "react-icons/bs"
import { RiContrast2Fill, RiContrast2Line } from "react-icons/ri";

const Controls = () => {
    return (
        <div className="grid grid-cols-3 grid-rows-3">
            <div className="relative right-[5%] bottom-[5%] rounded flex items-center justify-center w-[110%] h-[110%] bg-primary col-start-2 row-start-2">
                <span className="rounded-full bg-white bg-opacity-10 h-6 w-6 block" />
            </div>
            <button className="rounded-sm rounded-b-none col-start-2 btn btn-primary btn-sm btn-square" aria-label="Brightness Up"><BsFillBrightnessHighFill /></button>
            <button className="rounded-sm rounded-t-none col-start-2 row-start-3 btn btn-primary btn-sm btn-square" aria-label="Brightness Down"><BsBrightnessAltLowFill /></button>
            <button className="rounded-sm rounded-l-none col-start-3 row-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Up"><RiContrast2Fill /></button>
            <button className="rounded-sm rounded-r-none row-start-2 btn btn-primary btn-sm btn-square" aria-label="Contrast Down"><RiContrast2Line /></button>
        </div>
    )
}

export default Controls;
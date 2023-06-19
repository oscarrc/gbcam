import { PALETTES, PALETTE_NAMES } from "../../constants/colors";
import { useMemo, useRef } from "react";

import { PaletteIcon } from "../icons";

const Palette = ({ disabled, palette, setPalette }) => {
    const paletteRef = useRef(null);
    
    const disabledProps = useMemo(() => disabled ? { "aria-disabled": true } :  { tabIndex: 0 }, [disabled])

    const switchPalette = (p) => {
        localStorage.setItem("palette", p);
        paletteRef.current.blur();
        setPalette(p);
    }

    return (
        <div className="dropdown dropdown-end">
            <label {...disabledProps} role="button" ref={paletteRef} aria-label="Palete" className={`flex items-center gap-2 ${disabled && 'opacity-25 cursor-not-allowed'}`}>                            
                <PaletteIcon className="h-6 w-6" palette={PALETTES[palette]} />
            </label>
            <ul className="dropdown-content menu nav-menu shadow w-40 h-[calc(100vh - 4rem)] flex-row overflow-x-hidden bg-neutral top-8">
                {
                    PALETTE_NAMES.map( (p, i) => (
                        <li key={p}>
                            <button onClick={() => switchPalette(i) } className={`capitalize`}>
                                <PaletteIcon className="h-6 w-6" palette={PALETTES[i]}/>
                                {p}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Palette;
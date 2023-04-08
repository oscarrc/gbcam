import { useMemo, useRef } from "react";

import { PaletteIcon } from "../icons";

const PALETTES = ["DMG", "GBC 1", "GBC 2", "GBC 3", "GBC 4", "GBC 5", "GBC 6", "GBC 7", "GBC 8", "GBC 9", "GBC 10", "GBC 11", "GBC 12", "Gray"];

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
                <PaletteIcon className="h-6 w-6" palette={palette}/>
            </label>
            <ul className="dropdown-content menu nav-menu shadow w-40 bg-neutral top-8">
                {
                    PALETTES.map( (p, i) => (
                        <li key={p}>
                            <button onClick={() => switchPalette(i) } className={`capitalize`}>
                                <PaletteIcon className="h-6 w-6" palette={i}/>
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
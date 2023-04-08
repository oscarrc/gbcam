import { useMemo, useRef } from "react"

const Multiplier = ({ disabled, multiplier, setMultiplier }) => {
    const multiplierRef = useRef(null);
    
    const disabledProps = useMemo(() => disabled ? { "aria-disabled": true } :  { tabIndex: 0 }, [disabled])

    const switchMultiplier = (v) => {
        localStorage.setItem("multiplier", v);
        multiplierRef.current.blur();
        setMultiplier(v);
    }

    return (
        <div className="dropdown dropdown-end font-text self-end">
            <label {...disabledProps} role="button" ref={multiplierRef} aria-label="Model" className={`block font-bold leading-3 ${disabled && 'opacity-25 cursor-not-allowed'}`}>
                x{multiplier}
            </label>
            <ul className="dropdown-content menu nav-menu shadow bg-neutral top-8">
                {
                    Array.from({length: 4}, (_, i) => i + 1).map(m => (
                        <li key={m}>
                            <button onClick={() => switchMultiplier(m)}> x{m} </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Multiplier;
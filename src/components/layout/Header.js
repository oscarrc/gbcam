import { Cam, Model, Palette } from "../partials"

import { useGbCam } from "../../hooks/useGbCam";
import { useTheme } from "../../hooks/useTheme";

const Header = () => {
    const {theme, setTheme } = useTheme();
    const { facingUser, setFacingUser, palette, setPalette, capture } = useGbCam();
            
    return (
        <header className="relative w-full z-50">
            <nav className="navbar bg-gradient-gb text-neutral-content rounded-t-2xl border-b-2 border-primary border-opacity-20 min-h-12 py-0 px-12">
                <div className="flex-1">
                    <a href="/" className="btn btn-ghost normal-case text-2xl sm:text-4xl font-title italic">GBCam</a>
                </div>
                <div className="flex-none font-text mx-4 gap-2">
                    <Palette disabled={!!capture} palette={palette} setPalette={setPalette} />
                    <Cam theme={theme} setSelfie={setFacingUser} selfie={facingUser} />
                    <Model theme={theme} setTheme={setTheme} />
                </div>
            </nav>
        </header>
    )
}

export default Header;
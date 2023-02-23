import { BsChevronDown } from "react-icons/bs";

const MODELS = ["Yellow", "Red", "Black", "White", "Blue", "Green", "Transparent"];

const Header = () => {
    return (
        <header>
            <div class="navbar fixed w-full top-0 left-0 bg-neutral text-neutral-content border-b-2 border-primary border-opacity-20">
                <div class="flex-1">
                    <a href="/" class="btn btn-ghost normal-case text-4xl font-title italic">GBCam</a>
                </div>
                <div class="flex-none font-text">
                    <ul class="dropdown dropdown-end">
                        <li tabindex="0">
                            <label role="button" aria-label="Model" className="flex items-center gap-2 mx-4">Model<BsChevronDown className="inline h-2 w-2" /></label>
                            <div class="dropdown-content menu shadow w-40 bg-neutral">
                                <li><button className="normal-case">Classic DMG</button></li>
                                {
                                    MODELS.map(m => <li><button className="normal-case">{m}</button></li> )
                                }
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;
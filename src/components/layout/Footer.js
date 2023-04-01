import APPROVED from "../../constants/approved";
import { SiKofi } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="flex justify-center items-center pt-4 z-20 overflow-y-hidden">
            <div className="relative">
                {
                    APPROVED &&
                        <a className="btn btn-outline btn-xs rounded-full btn-primary opacity-50" href="https://ko-fi.com/oscarrc" target="_BLANK" rel="noreferrer noopener">
                            <SiKofi className="inline mr-2" /> Buy me a coffee
                        </a>
                }
                <div className="flex gap-1 justify-end opacity-20 mr-4">
                    <span className="h-2 w-1 bg-primary"></span>
                    <span className="h-2 w-1 bg-primary"></span>
                    <span className="h-2 w-1 bg-primary"></span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
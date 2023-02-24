import { SiKofi } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="flex justify-center items-center pb-2 pt-4">
            <a className="btn btn-outline btn-xs rounded-full btn-primary opacity-50" href="https://ko-fi.com/oscarrc" target="_BLANK" rel="noreferrer noopener">
                <SiKofi className="inline mr-2" /> Buy me a coffee
            </a>
        </footer>
    )
}

export default Footer;
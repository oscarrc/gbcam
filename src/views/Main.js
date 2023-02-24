import { Brand, Download, Mode, Share, Snap } from "../components/partials";

import Display from "../components/display";

const Main = () => {
    return (
        <section className="flex flex-col flex-1 items-center justify-center gap-8">
            <div className="max-w-[90%] md:max-w-display mt-24">
                <Display />
                <Brand />
            </div>
            <div className="max-w-[90%] md:max-w-display flex flex-col flex-1 justify-between items-center w-full">
                <div className="grid grid-cols-3 place-content-around place-items-center w-full">
                    <Download />
                    <Snap />
                    <Share />
                </div>
                <Mode />
            </div>
        </section>
    )
}

export default Main;
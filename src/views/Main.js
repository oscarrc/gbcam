import { Actions, Brand, Controls, Snap } from "../components/partials";

import Display from "../components/display";

const Main = () => {
    return (
        <section className="flex flex-col flex-1 items-center justify-center gap-2">
            <div className="max-w-[90%] md:max-w-display mt-24">
                <Display />
                <Brand />
            </div>
            <div className="max-w-[90%] md:max-w-display flex flex-col flex-1 justify-between items-center w-full">
                <div className="flex justify-between items-center w-full px-16">
                    <Controls />
                    <Snap />
                </div>
                <Actions />
            </div>
        </section>
    )
}

export default Main;
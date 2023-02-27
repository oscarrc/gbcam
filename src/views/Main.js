import { Actions, Brand, Controls, Snap } from "../components/partials";

import Display from "../components/display";

const Main = () => {
    return (
        <section className="flex flex-col flex-1 items-center justify-around px-12 md:max-w-display mt-24 mx-auto">
            <div className="">
                <Display />
                <Brand />
            </div>
            <div className="flex flex-col flex-1 justify-around items-center w-full">
                <div className="flex justify-between items-center w-full px-4">
                    <Controls />
                    <Snap />
                </div>
                <Actions />
            </div>
        </section>
    )
}

export default Main;
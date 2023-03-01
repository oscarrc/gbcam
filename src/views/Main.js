import { Actions, Brand, Controls, Snap } from "../components/partials";
import { useEffect, useState } from "react";

import Display from "../components/display";

const Main = () => {
    const [ landscape, setLandscape ] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkOrientation = () => setLandscape(window.innerWidth >= window.innerHeight);

        checkOrientation();
        window.addEventListener("resize", checkOrientation);

        return () => window.removeEventListener("resize", checkOrientation);
    }, [])

    const renderDisplay = () => {
        return (
            <div>
                <Display />
                <Brand />
            </div>
        )
    }

    return (
        <section className={`flex flex-col flex-1 items-center justify-around px-12 pt-8 x-auto ${landscape && "w-full"}`}>
            { !landscape && renderDisplay() }
            <div className="flex flex-col flex-1 justify-around items-center w-full">
                <div className={`flex ${landscape ? 'justify-around' : 'justify-between'} items-center w-full px-4`}>
                    <Controls />
                    { landscape && renderDisplay() }
                    <Snap />
                </div>
                <Actions />
            </div>
        </section>
    )
}

export default Main;
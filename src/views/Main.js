import { Actions, Brand, Buttons, DPad } from "../components/partials";
import { useEffect, useState } from "react";

import Display from "../components/display";

const Main = () => {
    const [ landscape, setLandscape ] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkOrientation = () => setLandscape(window.innerWidth >= window.innerHeight && window.innerWidth >= 768);
        
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
        <section className={`flex flex-col flex-1 items-center justify-around px-4 md:px-12 pt-8 w-full`}>
            { !landscape && renderDisplay() }
            <div className="flex flex-col flex-1 justify-around items-center w-full">
                <div className={`flex justify-between max-w-md md:justify-around md:max-w-none items-center w-full`}>
                    <DPad className="relative left-2" />
                    { landscape && renderDisplay() }
                    <Buttons className="relative -left-10" />
                </div>
                <div className="mt-4">
                    <Actions />
                </div>
            </div>
        </section>
    )
}

export default Main;
import { Actions, Brand, Controls, Snap } from "../components/partials";
import { useEffect, useState } from "react";

import Display from "../components/display";

const Main = () => {
    const [ landscape, setLandscape ] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkOrientation = () => setLandscape(window.innerWidth > window.innerHeight);

        checkOrientation();
        window.addEventListener("resize", checkOrientation);

        return () => window.removeEventListener("resize", checkOrientation);
    }, [])

    return (
        <section className="flex flex-col flex-1 items-center justify-around px-12 mt-24 mx-auto">
            {
                !landscape && 
                <div className="">
                    <Display />
                    <Brand />
                </div>
            }
            <div className="flex flex-col flex-1 justify-around items-center w-full">
                <div className="flex justify-between items-center w-full px-4  gap-16">
                    <Controls />
                    {
                        landscape &&
                        <div className="flex-1">
                            <Display />
                            <Brand />
                            {landscape}
                        </div>
                    }
                    <Snap />
                </div>
                <Actions />
            </div>
        </section>
    )
}

export default Main;
import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col bg-neutral w-full min-h-dscreen rounded-2xl rounded-br-[6rem]">
            <Header />
            <main className="flex flex-col flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;
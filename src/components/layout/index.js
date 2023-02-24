import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { CameraProvider } from "../../hooks/useCamera";

const Layout = () => {
    return (
        <div className="flex flex-col bg-neutral w-full min-h-dscreen rounded-2xl rounded-br-[6rem]">
            <Header />
            <main className="flex flex-col flex-1">
                <CameraProvider>
                    <Outlet />
                </CameraProvider>
            </main>
            <Footer />
        </div>
    )
}

export default Layout;
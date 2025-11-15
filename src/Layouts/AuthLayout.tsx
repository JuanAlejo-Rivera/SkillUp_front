import Logo from "@/components/Logo"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export const AuthLayout = () => {
    return (
        <>
            <div className="bg-slate-900 min-h-screen">
                <div className="py-10 lg:py-20 mx-auto w-[550px] max-sm:w-80">
                    <div className="flex justify-center items-center">
                        <Logo />
                    </div>
                    <div className="mt-10">
                        <Outlet />
                    </div>
                </div>
            </div>

            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                position='bottom-right'
                theme={'dark'}
            />

        </>
    )
}

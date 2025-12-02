import { Link, Navigate, Outlet } from 'react-router-dom'
import Logo from '@/components/Logo'
import NavMenu from '@/components/NavMenu'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '@/hooks/UserAuth'
import ReactSpinner from "@/components/ReactSpinner/ReactSpinner";

export const AppLayout = () => {
    const { data, isError, isLoading } = useAuth();
    if (isLoading) return <ReactSpinner />;
    if (isError) {
        return <Navigate to={'/auth/login'} />
    }

    if (data) return (
        <>
            <header
                className='bg-gray-800 py-5'
            >
                <div className='max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center'>
                    <div className='w-64'>
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>
                    <NavMenu
                        name={data.name}
                        role={data.role}
                    />
                </div>
            </header>

            <Outlet />

            <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700">
                <p className='py-5 text-center text-gray-400'>Todos los derechos reservados {new Date().getFullYear()}</p>
            </footer>

            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                position='bottom-right'
                theme={'dark'}
            />
        </>





    )
}

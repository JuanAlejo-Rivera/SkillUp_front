import { Link, Navigate, Outlet } from 'react-router-dom'
import Logo from '@/components/Logo'
import NavMenu from '@/components/NavMenu'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '@/hooks/UserAuth'

export const AppLayout = () => {
    const { data, isError, isLoading } = useAuth();

    if (isLoading) return 'Cargando...';
    if (isError) {
        return <Navigate to={'/auth/login'} />
    }

    return (
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
                    <NavMenu />
                </div>


            </header>

            <section className="max-w-screen-2xl mx-auto mmt-10 p-5">
                <Outlet />
            </section>

            <footer>
                <p className='py-5 text-center'>Todos los derechos reservados {new Date().getFullYear()}</p>
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

import { Link } from "react-router-dom"

export const DashboardView = () => {
    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5-xl font-black">Mis cursos</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Maneja y administra tus cursos</p>

                <nav className="my-5 ">
                    <Link
                        to={"/courses-create"}
                        className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Nuevo curso
                    </Link>
                </nav>
            </div>
        </>
    )
}

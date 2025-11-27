import CourseForm from "@/components/courses/courseForm"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import type { CourseFormData } from "@/types/index"
import { createCourse } from "@/api/CoursesAPI"

export const CreateCourseView = () => {

    const navigate = useNavigate()

    const initialValues: CourseFormData = {
        courseName: "",
        description: "",
        department: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createCourse,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate("/")
        }
    })

    const handleForm = (data: CourseFormData) => mutate(data)


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                    <h1 className="text-4xl font-black text-white mb-3">Añadir Nuevo Curso</h1>
                    <p className="text-lg font-light text-gray-300 mb-8">Completa los detalles a continuación para crear un nuevo curso.</p>

                <nav className="my-8 flex flex-col md:flex-row gap-4">
                    <Link
                        to={"/create-deparment"}
                        className="btn-secondary-action w-full md:w-auto text-center"
                    >
                        Crear nuevo departamento
                    </Link>
                </nav>

                <form
                    className="bg-gradient-to-br from-white to-gray-50 shadow-2xl p-10 rounded-3xl border-2 border-gray-200"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <CourseForm
                        register={register}
                        errors={errors}
                    />

                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200 mt-8">
                        <Link
                            to={"/"}
                            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Crear Curso
                        </button>

                    </div>
                </form>

                </div>
            </div>
        </>
    )
}

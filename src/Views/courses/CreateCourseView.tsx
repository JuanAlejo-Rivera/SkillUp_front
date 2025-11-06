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
            <div className="max-w-lg mx-auto ">

                <h1 className="text-2xl font-black">Añadir Nuevo Curso</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Completa los detalles a continuación para crear un nuevo curso.</p>

                <nav className="my-5 flex flex-col md:flex-row gap-3">
                    <Link
                        to={"/create-deparment"}
                        className="bg-sky-700 hover:bg-sky-800 py-3 px-3 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors w-full md:w-auto text-center"
                    >
                        Crear nuevo departamento
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-slate-200 shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <CourseForm
                        register={register}
                        errors={errors}
                    />

                    <div className="flex justify-between">
                        <Link
                            to={"/"}
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-medium transition"
                        >
                            Cancelar
                        </Link>

                        <input
                            type="submit"
                            value='Crear Curso'
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
                        />

                    </div>
                </form>


            </div>
        </>
    )
}

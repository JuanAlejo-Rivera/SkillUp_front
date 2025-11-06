import { Link, useNavigate } from "react-router-dom"
import CourseForm from "./courseForm"
import { useForm } from "react-hook-form"
import type { Course, CourseFormData } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCourse } from "@/api/CoursesAPI"
import { toast } from "react-toastify"

type editCourseFormProps = {
    data: CourseFormData
    courseId: Course['_id']
}

export default function EditCourseForm({ data, courseId }: editCourseFormProps) {

    const navigate = useNavigate()

    const initialValues: CourseFormData = {
        courseName: data.courseName,
        description: data.description,
        department: data.department
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateCourse,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            // queryClient.invalidateQueries({queryKey: ['courses']}) 
            queryClient.invalidateQueries({ queryKey: ['editCourse', courseId] })
            toast.success(data)
            navigate('/')
        }
    })


    const handleForm = (formData: CourseFormData) => {
        const data = {
            formData,
            courseId
        }
        mutate(data)
    }


    return (
        <>
            <div className="max-w-lg mx-auto ">


                <h1 className="text-2xl font-black">Editar Curso</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Completa los detalles a continuación para editar el curso.</p>

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
                            value='Guardar Cambios'
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
                        />

                    </div>
                </form>


            </div>
        </>
    )
}

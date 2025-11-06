import { createSection } from "@/api/SectionAPI"
import SectionForm from "@/components/sections/sectionsForm"
import type { SectionFormData } from "@/types/index"
import { useMutation } from "@tanstack/react-query"

import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const CreateSectionView = () => {

    const { state: { courseId, courseName } } = useLocation()

    const navigate = useNavigate();
    const initialValues: SectionFormData = {
        title: "",
        description: "",
    }


    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createSection,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate(`/courses/${courseId}/sections`, { state: { courseName } })
        }
    })


    const handleForm = (formData: SectionFormData) => {
        const data = {
            formData,
            courseId
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-lg mx-auto ">
                <h6 className="text-2xl font-semibold italic text-sky-600 drop-shadow-sm mb-5">
                    {courseName}
                </h6>

                <h1 className="text-2xl font-black">Añadir Nueva Sección</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Completa los detalles a continuación para crear una nueva sección.</p>

                <form
                    className="mt-10 bg-slate-200 shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <SectionForm
                        register={register}
                        errors={errors}
                    />

                    <div className="flex justify-between">
                        <Link
                            to={`/courses/${courseId}/sections`}
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-medium transition"
                            state={{ courseName }}
                        >
                            Cancelar
                        </Link>

                        <input
                            type="submit"
                            value='Crear Sección'
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
                        />

                    </div>
                </form>


            </div>
        </>
    )
}



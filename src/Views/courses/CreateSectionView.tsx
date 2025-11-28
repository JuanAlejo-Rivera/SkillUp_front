import { createSection } from "@/api/SectionAPI"
import { getCourseById } from "@/api/CoursesAPI"
import SectionForm from "@/components/sections/sectionsForm"
import type { SectionFormData } from "@/types/index"
import { useMutation, useQuery } from "@tanstack/react-query"

import { useForm } from "react-hook-form"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/UserAuth"
import { canModify } from "../../utils/policies"
import ReactSpinner from "@/components/ReactSpinner/ReactSpinner";

export const CreateSectionView = () => {

    const { data: user, isLoading: authLoading } = useAuth()
    const { state: { courseId, courseName } } = useLocation()

    const navigate = useNavigate();

    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        retry: false
    })
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

    if (authLoading && courseLoading) return <ReactSpinner />
    
    // Verificar si el usuario puede modificar el curso (admin o manager)
    if (course && user && !canModify(user, course.manager)) {
        return <Navigate to={'/'} />
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h6 className="text-2xl font-semibold italic text-blue-300 drop-shadow-sm mb-5">
                        {courseName}
                    </h6>

                    <h1 className="text-4xl font-black text-white mb-3">Añadir Nueva Sección</h1>
                    <p className="text-lg font-light text-gray-300 mb-8">Completa los detalles a continuación para crear una nueva sección.</p>

                <form
                    className="bg-gradient-to-br from-white to-gray-50 shadow-2xl p-10 rounded-3xl border-2 border-gray-200"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <SectionForm
                        register={register}
                        errors={errors}
                    />

                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200 mt-8">
                        <Link
                            to={`/courses/${courseId}/sections`}
                            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            state={{ courseName }}
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Crear Sección
                        </button>

                    </div>
                </form>

                </div>
            </div>
        </>
    )
}



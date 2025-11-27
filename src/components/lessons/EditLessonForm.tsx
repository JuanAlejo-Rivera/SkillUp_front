import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { Course, Lesson, LessonFormData, Section } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import LessonForm from "./LessonForm"
import { updateLesson } from "@/api/LessonsAPI"

type editLessonFormProps = {
    data: LessonFormData
    courseId: Course['_id']
    sectionId: Section['_id']
    lessonId: Lesson['_id']
    courseName: Course['courseName']
}

export default function EditLessonForm({ data, courseId, sectionId, lessonId, courseName }: editLessonFormProps) {
    const navigate = useNavigate()

    const initialValues: LessonFormData = {
        _id: data._id,
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        fileUrl: data.fileUrl,
        imageUrl: data.imageUrl
    }

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues: initialValues })
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateLesson,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['sections', sectionId] })
            queryClient.invalidateQueries({ queryKey: ['editSection', sectionId] })
            queryClient.invalidateQueries({ queryKey: ['lessons'] })
            queryClient.invalidateQueries({ queryKey: ['editLesson', lessonId] })
            toast.success(data)
            navigate(`/courses/${courseId}/sections/${sectionId}/lessons`, { state: { courseName } })
        }
    })


    const handleForm = (formData: LessonFormData) => {
        const data = {
            formData,
            courseId,
            sectionId,
            lessonId
        }
        mutate(data)
    }


    return (
        <>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h6 className="text-2xl font-semibold italic bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mb-5">
                    {courseName}
                </h6>

                <h1 className="text-4xl font-black text-slate-900 mb-3">Editar Lección</h1>
                <p className="text-lg font-light text-gray-600 mb-8">Completa los detalles a continuación para editar la Lección.</p>


                <form
                    className="bg-gradient-to-br from-white to-gray-50 shadow-2xl p-10 rounded-3xl border-2 border-gray-200"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <LessonForm
                        register={register}
                        errors={errors}
                        setValue={setValue}
                    />

                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200 mt-8">
                        <Link
                            to={`/courses/${courseId}/sections/${sectionId}/lessons`}
                            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            state={{ courseName }}
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Guardar Cambios
                        </button>

                    </div>
                </form>


            </div>
        </>
    )
}

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
            <div className="max-w-lg mx-auto ">
                <h6 className="text-2xl font-semibold italic text-sky-600 drop-shadow-sm mb-5">
                    {courseName}
                </h6>

                <h1 className="text-2xl font-black">Editar Lección</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Completa los detalles a continuación para editar la Lección.</p>

                <nav className="my-5 flex flex-col md:flex-row gap-3">
                    <Link
                        to={`/courses/${courseId}/sections/${sectionId}/lessons`}
                        className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors w-full md:w-auto text-center"
                        state={{ courseName }}
                    >
                        Volver a lecciones
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-slate-200 shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <LessonForm
                        register={register}
                        errors={errors}
                        setValue={setValue}
                    />

                    <div className="flex justify-end mt-10">

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

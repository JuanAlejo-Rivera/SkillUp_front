import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { Course, Section, SectionFormData } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { updateSection } from "@/api/SectionAPI"
import SectionForm from "./sectionsForm"

type editSectionFormProps = {
  data: SectionFormData
  courseId: Course['_id']
  sectionId: Section['_id']
  courseName: Course['courseName']
}

export default function EditSectionForm({ data, courseId, sectionId, courseName }: editSectionFormProps) {
  const navigate = useNavigate()

  const initialValues: SectionFormData = {
    title: data.title,
    description: data.description,
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateSection,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sections', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['editSection', sectionId] })
      toast.success(data)
      navigate(`/courses/${courseId}/sections`, { state: { courseName } })
    }
  })


  const handleForm = (formData: SectionFormData) => {
    const data = {
      formData,
      courseId,
      sectionId
    }
    mutate(data)
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h6 className="text-2xl font-semibold italic text-blue-300 drop-shadow-sm mb-5">
            {courseName}
          </h6>

          <h1 className="text-4xl font-black text-white mb-3">Editar Sección</h1>
          <p className="text-lg font-light text-gray-300 mb-8">Completa los detalles a continuación para editar la sección.</p>


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
              state={{ courseName: courseName }}

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
      </div>
    </>
  )
}

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
      <div className="max-w-lg mx-auto ">
        <h6 className="text-2xl font-semibold italic text-sky-600 drop-shadow-sm mb-5">
          {courseName}
        </h6>

        <h1 className="text-2xl font-black">Editar Sección</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Completa los detalles a continuación para editar la sección.</p>

        <nav className="my-5 flex flex-col md:flex-row gap-3">
          <Link
            to={`/courses/${courseId}/sections`}
            className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors w-full md:w-auto text-center"
            state={{courseName: courseName}}
          >
            Volver a secciones
          </Link>
        </nav>

        <form
          className="mt-10 bg-slate-200 shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >

          <SectionForm
            register={register}
            errors={errors}
          />

          <div className="flex justify-end">

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

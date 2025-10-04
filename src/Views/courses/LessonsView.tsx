import ModalLessonAdd from "@/components/lessons/ModalLessonAdd"
import { Link, useNavigate, useParams } from "react-router-dom"

export const LessonsView = () => {

  const navigate = useNavigate()

  const params = useParams()
  const courseId = params.courseId!
  const sectionId = params.sectionId!


  return (
    <>
      <div className="max-w-3xl mx-auto">



        <h1 className="text-xl font-black">Mis lecciones</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Maneja y administra las lecciones de la sección</p>

        <nav className="my-5 flex flex-col md:flex-row gap-3">
          <button
            type="button"
            className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + `?addLesson=true`)}
          >
            Agregar nueva lección
          </button>

          <Link
            className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
            to={`/courses/${courseId}/sections`}
          >
            Regresar a secciones
          </Link>
        </nav>
        <ModalLessonAdd />
      </div>
    </>
  )
}

import { deleteLesson, getLessons } from "@/api/LessonsAPI"
import ModalLessonAdd from "@/components/lessons/ModalLessonAdd"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Fragment } from "react/jsx-runtime"

export const LessonsView = () => {

  const navigate = useNavigate()

  const params = useParams()
  const courseId = params.courseId!
  const sectionId = params.sectionId!

  const { data, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => getLessons({ courseId, sectionId })
  })


  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteLesson,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      toast.success(data)
    }
  })

  if (isLoading) return 'Cargando...'

  if (data) return (
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

        {data.length ? (

          <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
            {data.map((lessons) => (
              <li key={lessons._id} className="flex justify-between gap-x-6 px-5 py-10">
                <div className="flex min-w-0 gap-x-4">
                  <div className='mb-2'>

                    <Link to={`/projects/${lessons._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >{lessons.title}</Link>

                    <p className="text-sm text-gray-400">
                      {lessons.description}
                    </p>

                    <p>
                      {lessons.videoUrl && (
                        <a
                          href={lessons.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver video
                        </a>
                      )}
                    </p>

                    <p>
                      {lessons.fileUrl && (
                        <a
                          href={lessons.fileUrl.replace("/upload/", "/upload/fl_attachment:false/")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver archivo
                        </a>
                      )}
                    </p>

                    <p>
                      {lessons.imageUrl && (
                        <a
                          href={lessons.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver imagen
                        </a>
                      )}
                    </p>


                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </MenuButton>
                    <Transition as={Fragment} enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <MenuItems
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                      >
                        <>
                          <MenuItem>
                            <Link to={`/courses/${courseId}/sections/${sectionId}/lesson/${lessons._id}/edit`}
                              className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                              Editar Lección
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type='button'
                              className='block px-3 py-1 text-sm leading-6 text-red-500'
                              // onClick={() => navigate(location.pathname + `?deleteProject=${lessons._id}`)}
                              onClick={() => mutate({ courseId, sectionId, lessonId: lessons._id })}
                            >
                              Eliminar Lección
                            </button>
                          </MenuItem>

                        </>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">No hay proyectos creados {' '}
            <Link
              to={"/projects-create"}
              className="text-gradient font-bold"
            >Crear Proyecto</Link>
          </p>
        )}




        <ModalLessonAdd />
      </div>
    </>
  )
}

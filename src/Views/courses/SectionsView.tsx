import { deleteSection, getSections } from "@/api/SectionAPI"
import { getCourseById } from "@/api/CoursesAPI"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import { Fragment } from 'react'
import { toast } from "react-toastify"
import BackButton from "@/components/arrowBack/backButton"
import { useAuth } from "@/hooks/UserAuth"
import { canModify, isAdmin, isTeacher } from "../../utils/policies"

export const SectionsView = () => {

  const { data: user, isLoading: authLoading } = useAuth()

  const params = useParams()
  const courseId = params.courseId!

  const location = useLocation();
  const courseName = location.state?.courseName;
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sections'],
    queryFn: () => getSections(courseId),
    retry: false
  })

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    retry: false
  })

  const { mutate } = useMutation({
    mutationFn: deleteSection,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      toast.success(data)
    }
  })

  // console.log(course?.manager)

  if (isError) return <Navigate to={'/404'} />
  if (isLoading && authLoading && courseLoading) return 'Cargando...'

  if (data && user && course) return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-4">
            <BackButton
              to={`/`}
              title="Volver a cursos"
              position=""
              state={{ courseName: courseName }}
            />
          </div>

          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-6 mb-8 shadow-xl border-2 border-blue-600">
            <h6 className="text-3xl font-black text-white drop-shadow-lg mb-2">
              📚 {courseName}
            </h6>
            <p className="text-blue-200 text-sm">Curso activo</p>
          </div>

          <h1 className="text-4xl font-black text-white mb-3">Mis secciones</h1>
          {(isAdmin(user) || isTeacher(user)) && (
            <p className="text-lg font-light text-gray-300 mb-8">Maneja y administra tus secciones</p>
          )}

          <nav className="my-8 flex flex-wrap gap-4">
            {canModify(user, course.manager) && (
              <Link
                className="btn-primary-action"
                state={{ courseId, courseName }}
                to={'/create-section'}
              >
                Nueva sección
              </Link>
            )}

          </nav>

          {data.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {data.map((sections) => (
                <div key={sections._id} className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl shadow-xl border-2 border-blue-700/50 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 p-6 flex flex-col justify-between h-full">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <Link to={`/courses/${courseId}/sections/${sections._id}/lessons`}
                          className="text-white cursor-pointer hover:text-blue-300 text-2xl font-bold block transition-colors mb-3"
                          state={{ courseName: courseName }}
                        >{sections.title}</Link>
                      </div>
                      <Menu as="div" className="relative flex-none z-50">
                        <MenuButton className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                          <span className="sr-only">opciones</span>
                          <EllipsisVerticalIcon className="h-7 w-7 text-white hover:text-blue-200" aria-hidden="true" />
                        </MenuButton>
                        <Transition as={Fragment} enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95">
                          <MenuItems className="dropdown-menu">
                            <MenuItem>
                              <Link to={`/courses/${courseId}/sections/${sections._id}/lessons`}
                                className='dropdown-item'
                                state={{ courseName: courseName }}
                              >
                                Ver Lecciones
                              </Link>
                            </MenuItem>
                            {canModify(user, course.manager) && (
                              <>
                                <MenuItem>
                                  <Link to={`/courses/${courseId}/sections/${sections._id}/edit`}
                                    className='dropdown-item'
                                    state={{ courseName: courseName }}
                                  >
                                    Editar Sección
                                  </Link>
                                </MenuItem>
                                <MenuItem>
                                  <button
                                    type='button'
                                    className='dropdown-item-danger w-full text-left'
                                    onClick={() => mutate({ courseId, sectionId: sections._id })}
                                  >
                                    Eliminar Sección
                                  </button>
                                </MenuItem>
                              </>
                            )}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {sections.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-12 border-2 border-dashed border-gray-300 rounded-2xl">
              <p className="text-gray-600 text-lg font-semibold">No hay secciones disponibles</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

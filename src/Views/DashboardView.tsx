import { Link, useNavigate } from "react-router-dom"

import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import ModalDeparmentAdd from "@/components/department/ModalDepartments"
import { useAuth } from "@/hooks/UserAuth"
import { isManager, canModify, canCreateCourses, isAdmin, isTeacher } from "../utils/policies"
import { formatDate } from "../utils/utils"
import DeleteCourseModal from "@/components/courses/DeleteCourses"
import { getCourses } from "@/api/CoursesAPI"
import { useQuery } from "@tanstack/react-query"


export const DashboardView = () => {

    const navigate = useNavigate();

    const { data: user, isLoading: authLoading } = useAuth()

    const { data, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses
    })

    // console.log(user)
    // console.log(data)

    if (isLoading && authLoading) return 'Cargando...'
    if (data && user) return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-4xl font-black text-white mb-3">Mis cursos</h1>
                {(isAdmin(user) || isTeacher(user)) && (
                    <p className="text-lg font-light text-gray-300 mb-8">Maneja y administra tus cursos</p>
                )}

                <nav className="my-8 flex flex-wrap gap-4">
                    {canCreateCourses(user) && (
                        <Link
                            to="/courses-create"
                            className="btn-primary-action"
                        >
                            Nuevo curso
                        </Link>
                    )}

                    {(isAdmin(user) || isTeacher(user)) && (
                        <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() =>
                                navigate(location.pathname + `?addDepartment=true`)
                            }
                        >
                            Gestión de departamentos
                        </button>
                    )}
                </nav>
                {data.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {data.map((course) => (
                            <div key={course._id} className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl shadow-xl border-2 border-blue-700/50 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 overflow-hidden p-6 flex flex-col justify-between h-full">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            {isManager(course.manager._id, user._id) && (
                                                <span className='font-bold text-xs uppercase bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 border-2 border-blue-300 rounded-xl inline-block py-2 px-4 shadow-md'>Creador</span>
                                            )}
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
                                                        <Link
                                                            to={`/courses/${course._id}/sections`}
                                                            state={{ courseName: course.courseName }}
                                                            className='dropdown-item'>
                                                            Ver Secciones
                                                        </Link>
                                                    </MenuItem>
                                                    {canModify(user, course.manager._id) && (
                                                        <>
                                                            <MenuItem>
                                                                <Link to={`/courses/${course._id}/edit`}
                                                                    className='dropdown-item'>
                                                                    Editar Curso
                                                                </Link>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <button
                                                                    type='button'
                                                                    className='dropdown-item-danger w-full text-left'
                                                                    onClick={() => navigate(location.pathname + `?deleteProject=${course._id}`)}
                                                                >
                                                                    Eliminar Curso
                                                                </button>
                                                            </MenuItem>
                                                        </>
                                                    )}
                                                </MenuItems>
                                            </Transition>
                                        </Menu>
                                    </div>
                                    
                                    <Link
                                        to={`/courses/${course._id}/sections`}
                                        state={{ courseName: course.courseName }}
                                        className="text-white cursor-pointer hover:text-blue-300 text-2xl font-bold mb-3 block transition-colors"
                                    >{course.courseName}</Link>
                                    
                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm font-semibold text-blue-200 bg-blue-950/50 px-3 py-1 rounded-lg inline-block border border-blue-700">
                                            Departamento: {course.department?.departmentName}
                                        </p>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {course.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-700/50 pt-4 mt-4 space-y-3">
                                    <p className="text-sm text-gray-300">
                                        Creado por: <span className="font-bold text-blue-300">{course.manager.name}</span>
                                    </p>
                                    {course.lastEditedBy && course.lastEditedBy._id !== course.manager._id && (
                                        <p className='text-xs text-gray-400'>
                                            Última edición por: <span className="font-semibold text-gray-300">{course.lastEditedBy.name}</span>
                                        </p>
                                    )}
                                    <p className='text-xs text-gray-400'>Creado: {formatDate(course.createdAt)}</p>
                                    <p className='text-xs text-gray-400'>Actualizado: {formatDate(course.updatedAt)}</p>
                                    
                                    <Link
                                        to={`/courses/${course._id}/sections`}
                                        state={{ courseName: course.courseName }}
                                        className="inline-block mt-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        Ver Secciones
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-12 border-2 border-dashed border-gray-300 rounded-2xl">
                        <p className="text-gray-600 text-lg font-semibold">No hay cursos disponibles</p>
                    </div>
                )}
                <ModalDeparmentAdd />
                <DeleteCourseModal />
              </div>
            </div>
        </>
    )
}

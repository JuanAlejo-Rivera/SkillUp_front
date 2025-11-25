import { deleteCorse, getCourses } from "@/api/CoursesAPI"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"

import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { toast } from "react-toastify"
import ModalDeparmentAdd from "@/components/department/ModalDepartments"
import { useAuth } from "@/hooks/UserAuth"
import { isManager } from "../utils/policies"


export const DashboardView = () => {

    const navigate = useNavigate();

    const { data: user, isLoading: authLoading } = useAuth()

    const { data, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteCorse,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            toast.success(data)
        }
    })

    // console.log(user)
    // console.log(data)

    if (isLoading && authLoading) return 'Cargando...'
    if (data && user) return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-black">Mis cursos</h1>
                <p className="text-xl font-light text-gray-500 mt-5">Maneja y administra tus cursos</p>

                <nav className="my-5 flex gap-3">
                    <Link
                        to={"/courses-create"}
                        className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Nuevo curso
                    </Link>

                    <button
                        type="button"
                        className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
                        onClick={() =>
                            navigate(location.pathname + `?addDepartment=true`)
                        }
                    >
                        Gestión de departamentos
                    </button>
                </nav>
                {data.length ? (
                    <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
                        {data.map((course) => (
                            <li key={course._id} className="flex justify-between gap-x-6 px-5 py-10">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto space-y-2">
                                        <div className="min-w-0 flex-auto space-y-2">

                                            {isManager(course.manager._id, user._id) ?
                                                <p className='font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5'>Creador</p> :
                                                null
                                            }
                                        </div>
                                        <Link
                                            to={`/courses/${course._id}/sections`}
                                            state={{ courseName: course.courseName }}
                                            className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                                        >{course.courseName}</Link>
                                        <p className="text-sm text-gray-400">
                                            Departamento: {course.department?.departmentName}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {course.description}
                                        </p>
                                        <p>
                                            Creado por: <span className="font-bold text-gray-600">{course.manager.name}</span>
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
                                                <MenuItem>
                                                    <Link
                                                        to={`/courses/${course._id}/sections`}
                                                        state={{ courseName: course.courseName }}
                                                        className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                                        Ver Secciones
                                                    </Link>
                                                </MenuItem>
                                                {isManager(course.manager._id, user._id) && (
                                                    <>
                                                        <MenuItem>
                                                            <Link to={`/courses/${course._id}/edit`}
                                                                className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                                                Editar Curso
                                                            </Link>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <button
                                                                type='button'
                                                                className='block px-3 py-1 text-sm leading-6 text-red-500'
                                                                onClick={() => mutate(course._id)}
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
                            </li>
                        ))}
                    </ul>

                ) : (
                    <p className="text-center text-gray-600 uppercase p-5 border border-gray-300 rounded-lg">No hay cursos disponibles</p>
                )}
                <ModalDeparmentAdd />
            </div>
        </>
    )
}

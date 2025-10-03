import { getSections } from "@/api/SectionAPI"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { Fragment } from 'react'

export const SectionsView = () => {

  const params = useParams()
  const courseId = params.courseId!


  const { data, isLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: () => getSections(courseId)
  })


  if (isLoading) return 'Cargando...'

  if (data) return (
    <>
      <div className="max-w-3xl mx-auto">

        <h1 className="text-5-xl font-black">Mis secciones</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Maneja y administra tus secciones</p>

        <nav className="my-5 flex flex-col md:flex-row gap-3">
          <Link
            className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
            state={{ courseId }}
            to={'/create-section'}
          >
            Nueva sección
          </Link>
          <Link
            className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
            to={'/'}
          >
            Regresar a cursos
          </Link>
        </nav>

        {data.length ? (
          <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
            {data.map((sections) => (
              <li key={sections._id} className="flex justify-between gap-x-6 px-5 py-10">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <Link to={`/sections/view`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >{sections.title}</Link>

                    <p className="text-sm text-gray-400">
                      {sections.description}
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
                          <Link to={`/sections/view`}
                            className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                            Ver Secciones
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link to={`/courses/${sections._id}/edit`}
                            className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                            Editar Curso
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <button
                            type='button'
                            className='block px-3 py-1 text-sm leading-6 text-red-500'
                            onClick={() => { }}
                          >
                            Eliminar Curso
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>

        ) : (
          <p className="text-center text-gray-600 uppercase p-5 border border-gray-300 rounded-lg">No hay secciones disponibles</p>
        )}
      </div>
    </>
  )
}

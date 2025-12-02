import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../types';

type NavMenuProps = {
  name: User['name'];
  role: User['role'];
}

export default function NavMenu({ name, role }: NavMenuProps) {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    // queryClient.invalidateQueries({queryKey: ['user']}); // invalidamos el cache de la consulta del usuario
    queryClient.clear(); // limpiamos el cache de todas las consultas
    navigate('/auth/login');
  }


  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center p-3 rounded-full bg-gradient-to-r from-blue-900 to-blue-800 border-2 border-blue-700 text-white hover:from-blue-800 hover:to-blue-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
        <Bars3Icon className="w-7 h-7" />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute right-0 z-50 mt-5">
          <div className="w-64 shrink rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-sm font-semibold leading-6 text-gray-900 shadow-2xl ring-2 ring-gray-200">
            <p className='text-center text-lg font-bold text-slate-900 mb-4 pb-4 border-b-2 border-gray-200'>Hola: {name}</p>
            <p className='text-center text-lg font-bold text-slate-900 mb-4 pb-4 border-b-2 border-gray-200'>
              <span className='text-blue-700'>
                {role === 'admin' && 'Administrador'}
                {role === 'teacher' && 'Profesor'}
                {role !== 'admin' && role !== 'teacher' && 'Estudiante'}
              </span>
            </p>
            <Link
              to='/profile'
              className='block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-900 transition-all duration-200 font-medium'
            >Mi Perfil</Link>
            <Link
              to='/'
              className='block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-900 transition-all duration-200 font-medium'
            >Mis Cursos</Link>
            <button
              className='block w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium mt-2 border-t-2 border-gray-200 pt-4'
              type='button'
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}
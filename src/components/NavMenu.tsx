import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../types';

type NavMenuProps = {
  name: User['name'];
}

export default function NavMenu({name}: NavMenuProps) {
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
      <PopoverButton className="inline-flex items-center p-2 rounded-full border border-sky-600 text-white hover:bg-sky-800 hover:scale-110 transition">
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
        <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className='text-center'>Hola: {name}</p>
            <Link
              to='/profile'
              className='block p-2 hover:text-sky-800'
            >Mi Perfil</Link>
            <Link
              to='/'
              className='block p-2 hover:text-sky-800'
            >Mis Proyectos</Link>
            <button
              className='block p-2 hover:text-sky-800'
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
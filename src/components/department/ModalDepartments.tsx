import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DepartmentList } from './DepartmentList';
import { XMarkIcon } from "@heroicons/react/24/outline"

export default function ModalDeparmentAdd() {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tracker = queryParams.get('addDepartment');


    const show = tracker ? true : false;
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true, state: location.state })}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6 sm:p-10"
                            >
                                <button
                                    type="button"
                                    onClick={() => navigate(location.pathname, { replace: true, state: location.state })}
                                    title="Cerrar"
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-600 transition"
                                >
                                    <XMarkIcon className="h-7 w-7 text-slate-900 hover:text-white" />
                                </button>


                                <DialogTitle
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Administra tus departamentos
                                </DialogTitle>


                                <DepartmentList />

                                <div className="flex justify-end mt-10">
                                    <Link
                                        to={"/create-deparment"}
                                        className="bg-sky-700 hover:bg-sky-800 py-3 px-3 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors w-full md:w-auto text-center"
                                    >
                                        Crear nuevo departamento
                                    </Link>
                                </div>


                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}
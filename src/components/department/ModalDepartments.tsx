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
            <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true, state: location.state })}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="modal-overlay" />
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
                                className="modal-content relative w-full max-w-4xl transform overflow-hidden text-left align-middle shadow-2xl transition-all p-6 sm:p-10"
                            >
                                <button
                                    type="button"
                                    onClick={() => navigate(location.pathname, { replace: true, state: location.state })}
                                    title="Cerrar"
                                    className="absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-600 transition-all duration-300 group"
                                >
                                    <XMarkIcon className="h-7 w-7 text-red-600 group-hover:text-white transition-colors" />
                                </button>


                                <DialogTitle
                                    as="h3"
                                    className="font-black text-4xl text-slate-900 my-5"
                                >
                                    Administra tus departamentos
                                </DialogTitle>


                                <DepartmentList />

                                <div className="flex justify-end mt-10 pt-6 border-t-2 border-gray-200">
                                    <Link
                                        to={"/create-deparment"}
                                        className="btn-primary-action w-full md:w-auto text-center"
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
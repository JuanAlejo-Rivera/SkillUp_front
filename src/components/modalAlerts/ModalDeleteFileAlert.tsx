import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { Fragment } from "react";

type DeleteFileAlertProps = {
    isOpen: boolean;
    confirmDelete: () => void;
    cancelDelete: () => void;
}

export const ModalDeleteFileAlert = ({ isOpen, confirmDelete, cancelDelete }: DeleteFileAlertProps) => {
    return (
        < Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[200]" onClose={cancelDelete}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                                            Eliminar archivo
                                        </DialogTitle>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-600">
                                        ¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer y el archivo se eliminará permanentemente de Cloudinary.
                                    </p>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={cancelDelete}
                                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDelete}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

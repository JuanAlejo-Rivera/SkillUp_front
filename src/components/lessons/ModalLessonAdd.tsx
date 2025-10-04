import { Fragment, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ModalLessonAdd() {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tracker = queryParams.get('addLesson');

    const show = tracker ? true : false;

    // Refs para inputs ocultos
    const videoRef = useRef<HTMLInputElement>(null);
    const docRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const handleBoxClick = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10">
                                
                                <DialogTitle as="h3" className="font-black text-3xl text-slate-700 mb-6">
                                    Agregar nueva lección
                                </DialogTitle>

                                {/* Form */}
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Escribe el título de la lección"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Escribe una breve descripción"
                                        />
                                    </div>

                                    {/* file upload */}
                                    <div>
                                        <p className="text-lg font-semibold text-slate-700 mb-3">
                                            Archivos adjuntos
                                        </p>
                                        <div className="grid grid-cols-3 gap-6">
                                            
                                            {/* Video */}
                                            <div
                                                // onClick={() => handleBoxClick(videoRef)}
                                                className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 transition"
                                            >
                                                <PlusIcon className="w-10 h-10 text-slate-400" />
                                                <p className="text-sm text-slate-500 mt-2">Subir Video</p>
                                                <input
                                                    ref={videoRef}
                                                    type="file"
                                                    accept="video/*"
                                                    hidden
                                                />
                                            </div>

                                            {/* Document */}
                                            <div
                                                // onClick={() => handleBoxClick(docRef)}
                                                className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 transition"
                                            >
                                                <PlusIcon className="w-10 h-10 text-slate-400" />
                                                <p className="text-sm text-slate-500 mt-2">Subir Documento</p>
                                                <input
                                                    ref={docRef}
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    hidden
                                                />
                                            </div>

                                            {/* Imagen */}
                                            <div
                                                // onClick={() => handleBoxClick(imageRef)}
                                                className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 transition"
                                            >
                                                <PlusIcon className="w-10 h-10 text-slate-400" />
                                                <p className="text-sm text-slate-500 mt-2">Subir Imagen</p>
                                                <input
                                                    ref={imageRef}
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(location.pathname, { replace: true })}
                                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { checkPasswordForm } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { checkPassword } from '@/api/AuthApi';
import { deleteSection } from '@/api/SectionAPI';

export default function DeleteSectionModal() {
    const initialValues: checkPasswordForm = {
        password: ''
    }
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const courseId = params.courseId!

    const queryParams = new URLSearchParams(location.search);
    const deleteSectionId = queryParams.get('deleteSection')!;
    const show = deleteSectionId ? true : false

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()

    const checkUserPasswordMutation = useMutation({
        mutationFn: checkPassword,
        onError: (error) => toast.error(error.message)
    })

    const deleteSectionMutation = useMutation({
        mutationFn: deleteSection,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['sections'] })
        }
    })

    const handleForm = async (formData: checkPasswordForm) => {
        // Todos los usuarios deben verificar su contraseña
        await checkUserPasswordMutation.mutateAsync(formData)
        await deleteSectionMutation.mutateAsync({ courseId, sectionId: deleteSectionId })
        navigate(location.pathname, { replace: true })
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true })}>
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
                            <DialogPanel className="modal-content w-full max-w-2xl transform overflow-hidden text-left align-middle shadow-2xl transition-all p-10">

                                <DialogTitle
                                    as="h3"
                                    className="font-black text-4xl text-red-700 mb-6"
                                >Eliminar Sección</DialogTitle>

                                <p className="text-lg font-semibold text-gray-700 mb-8">Confirma la eliminación de la sección {''}
                                    <span className="text-gradient">colocando tu password</span>
                                </p>

                                <form
                                    className="space-y-6"
                                    onSubmit={handleSubmit(handleForm)}
                                    noValidate
                                >

                                    <div className="flex flex-col gap-3">
                                        <label
                                            className="font-semibold text-lg text-gray-800"
                                            htmlFor="password"
                                        >Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Password Inicio de Sesión"
                                            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                                            {...register("password", {
                                                required: "El password es obligatorio",
                                            })}
                                        />
                                        {errors.password && (
                                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-xl rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        Eliminar Sección
                                    </button>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

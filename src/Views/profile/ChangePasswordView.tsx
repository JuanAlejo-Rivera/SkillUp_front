import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import type { UpdateCurrentUserPassword } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileAPI";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
    const initialValues = {
        current_password: '',
        password: '',
        password_confirmation: ''
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues })
    const password = watch('password');

    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => toast.success(data)
    })


    const handleChangePassword = (formData: UpdateCurrentUserPassword) => mutate(formData);

    return (
        <>
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-black text-white mb-3">Cambiar Contraseña</h1>
                <p className="text-lg font-light text-gray-300 mb-8">Utiliza este formulario para cambiar tu contraseña</p>

                    <form
                        onSubmit={handleSubmit(handleChangePassword)}
                        className="bg-gradient-to-br from-white to-gray-50 shadow-2xl p-10 rounded-3xl border-2 border-gray-200 space-y-5"
                        noValidate
                    >
                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="current_password"
                        >Password Actual</label>
                        <input
                            id="current_password"
                            type="password"
                            placeholder="Password Actual"
                            className="w-full p-3  border border-gray-200"
                            {...register("current_password", {
                                required: "El password actual es obligatorio",
                            })}
                        />
                        {errors.current_password && (
                            <ErrorMessage>{errors.current_password.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="password"
                        >Nuevo Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nuevo Password"
                            className="w-full p-3  border border-gray-200"
                            {...register("password", {
                                required: "El Nuevo Password es obligatorio",
                                minLength: {
                                    value: 8,
                                    message: 'El Password debe ser mínimo de 8 caracteres'
                                }
                            })}
                        />
                        {errors.password && (
                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="mb-5 space-y-3">
                        <label
                            htmlFor="password_confirmation"
                            className="text-sm uppercase font-bold"
                        >Repetir Password</label>

                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="Repetir Password"
                            className="w-full p-3  border border-gray-200"
                            {...register("password_confirmation", {
                                required: "Este campo es obligatorio",
                                validate: value => value === password || 'Los Passwords no son iguales'
                            })}
                        />
                        {errors.password_confirmation && (
                            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Cambiar Contraseña
                    </button>
                </form>
            </div>
        </>
    )
}
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage";
import type { ForgotPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/AuthApi";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: ''
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
        }
    })

    const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData);


    return (
        <>
            <h1 className="text-5xl font-black text-white mb-4">Reestablecer contraseña</h1>
            <p className="text-xl font-light text-gray-200 mb-10">
                ¿Olvidaste tu contraseña? Coloca tu email {''}
                <span className="text-gradient font-bold">y reestablece tu contraseña</span>
            </p>

            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-6 p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200"
                noValidate
            >
                <div className="flex flex-col gap-3">
                    <label
                        className="font-semibold text-xl text-slate-900"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 w-full p-4 text-white font-black text-xl cursor-pointer rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    Enviar Instrucciones
                </button>
            </form>

            <nav className="mt-8 flex flex-col space-y-3">
                <Link
                    to='/auth/login'
                    className="text-center text-gray-200 hover:text-white font-medium transition-colors"
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>

                <Link
                    to='/auth/register'
                    className="text-center text-gray-200 hover:text-white font-medium transition-colors"
                >
                    ¿No tienes cuenta? Crea una
                </Link>
            </nav>
        </>
    )
}
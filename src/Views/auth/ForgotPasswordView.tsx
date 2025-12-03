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
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Recuperar acceso
                </h1>
                <p className="text-lg text-gray-300 font-light">
                    Te enviaremos instrucciones a tu correo
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-5 p-8 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20"
                noValidate
            >
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 tracking-wide" htmlFor="email">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
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
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                    Enviar instrucciones
                </button>
            </form>

            <div className="mt-8 space-y-4 text-center">
                <Link
                    to='/auth/login'
                    className="block text-gray-400 hover:text-blue-400 font-medium transition-colors duration-200"
                >
                    Volver a <span className="text-blue-400 font-semibold">Iniciar sesión</span>
                </Link>
                <Link
                    to='/auth/register'
                    className="block text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                    ¿No tienes cuenta? Regístrate
                </Link>
            </div>
        </>
    )
}
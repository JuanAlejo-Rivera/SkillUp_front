import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { UserRegistrationForm } from "@/types/index";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthApi";
import { toast } from "react-toastify";

export default function RegisterView() {

    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
        }
    })


    const password = watch('password');

    const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

    return (
        <>
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Únete Ahora
                </h1>
                <p className="text-lg text-gray-300 font-light">
                    Comienza tu viaje de aprendizaje hoy
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleRegister)}
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 tracking-wide">
                        Nombre completo
                    </label>
                            <input
                                type="text"
                                placeholder="Juan Pérez"
                                className="w-full px-4 py-3.5 bg-slate-900/50 border border-white rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                                {...register("name", {
                                    required: "El Nombre de usuario es obligatorio",
                                })}
                            />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 tracking-wide">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                        {...register("password", {
                            required: "El Password es obligatorio",
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 tracking-wide">
                        Confirmar contraseña
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite tu contraseña"
                        className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                        {...register("password_confirmation", {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />
                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                >
                    Crear cuenta
                </button>
            </form>
            <div className="mt-8 text-center">
                <Link
                    to={'/auth/login'}
                    className="block text-gray-400 hover:text-cyan-400 font-medium transition-colors duration-200"
                >
                    ¿Ya tienes cuenta? <span className="text-cyan-400 font-semibold">Inicia sesión</span>
                </Link>
            </div>
            <div className="mt-4 text-center">
                <Link
                    to={'/auth/forgot-password'}
                    className="block text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </div>
        </>
    )
}
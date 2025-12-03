import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updatePasswordWithToken } from "@/api/AuthApi";

type NewPasswordTokenProps = {
    token: ConfirmToken['token'];
}



export default function NewPasswordForm({token} : NewPasswordTokenProps) {
    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
            navigate('/auth/login');
        }
    })

    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token
        }
        mutate(data);
    }

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-5 p-8 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20"
                noValidate
            >

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 tracking-wide">
                        Nueva contraseña
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
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                    Establecer contraseña
                </button>
            </form>
        </>
    )
}
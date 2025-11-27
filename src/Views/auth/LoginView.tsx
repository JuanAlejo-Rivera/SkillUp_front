import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { UserLoginForm } from "@/types/index";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authenticateUser } from "@/api/AuthApi";
import { useMutation } from "@tanstack/react-query";

export default function LoginView() {

  const navigate = useNavigate();
  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error: Error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })


  const handleLogin = (formData: UserLoginForm) => mutate(formData);

  return (
    <>
      <h1 className="text-5xl font-black text-white mb-4">Iniciar Sesión</h1>
      <p className="text-xl font-light text-gray-200 mb-10">
        Comienza a mejorar tus habilidades {''}
        <span className="text-gradient font-bold">
          iniciando sesión en este formulario</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-6 p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200"
        noValidate
      >
        <div className="flex flex-col gap-3">
          <label
            className="font-semibold text-xl text-slate-900"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            {...register("email", {
              required: "El Email es obligatorio",
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

        <div className="flex flex-col gap-3">
          <label
            className="font-semibold text-xl text-slate-900"
          >Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 w-full p-4 text-white font-black text-xl cursor-pointer rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Iniciar Sesión
        </button>
      </form>

      <nav className="space-y-3 mt-8">
        <Link
          to={'/auth/register'}
          className="text-center text-gray-200 hover:text-white font-medium block transition-colors"
        >
          ¿No tienes cuenta? Crear una
        </Link>
        <Link
          to={'/auth/forgot-password'}
          className="text-center text-gray-200 hover:text-white font-medium block transition-colors"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  )
}
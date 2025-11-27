import { Link } from "react-router-dom";
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useState } from "react";
import type { ComfirmToken } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "@/api/AuthApi";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {

  const [token, setToken] = useState<ComfirmToken['token']>('')

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
    }
  })

  const handleChange = (token: ComfirmToken['token']) => {
    setToken(token);
  }

  const handleComplete = (token: ComfirmToken['token']) => mutate({ token })

  return (
    <>
      <h1 className="text-5xl font-black text-white mb-4">Confirma tu Cuenta</h1>
      <p className="text-xl font-light text-gray-200 mb-10">
        Ingresa el código que recibiste {''}
        <span className="text-gradient font-bold">por e-mail</span>
      </p>
      <form
        className="space-y-6 p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200"
      >
        <label
          className="font-semibold text-xl text-slate-900 text-center block"
        >Código de 6 dígitos</label>

        <div className="flex justify-center gap-3">
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className="w-12 h-12 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold text-slate-900" />
            <PinInputField className="w-12 h-12 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold text-slate-900" />
            <PinInputField className="w-12 h-12 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold text-slate-900" />
            <PinInputField className="w-12 h-12 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold text-slate-900" />
            <PinInputField className="w-12 h-12 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold text-slate-900" />
            <PinInputField className="w-12 h-12 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-center text-xl font-bold text-slate-900" />
          </PinInput>
        </div>

      </form>

      <nav className="mt-8 flex flex-col space-y-3">
        <Link
          to='/auth/request-code'
          className="text-center text-gray-200 hover:text-white font-medium transition-colors"
        >
          Solicitar un nuevo Código
        </Link>
        <Link
          to='/auth/login'
          className="text-center text-gray-200 hover:text-white font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          ¿Ya estas verificado? Iniciar Sesión
        </Link>
      </nav>

    </>
  )
}
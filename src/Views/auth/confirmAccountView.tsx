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
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-6xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Verificación
        </h1>
        <p className="text-lg text-gray-300 font-light">
          Ingresa el código de 6 dígitos que enviamos a tu correo
        </p>
      </div>
      
      <div className="p-8 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20">
        <label className="text-sm font-medium text-gray-300 tracking-wide text-center block mb-6">
          Código de verificación
        </label>

        <div className="flex justify-center gap-2">
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
            <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
            <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
            <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
            <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
            <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
          </PinInput>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-center">
        <Link
          to='/auth/request-code'
          className="block text-gray-400 hover:text-cyan-400 font-medium transition-colors duration-200"
        >
          ¿No recibiste el código? <span className="text-cyan-400 font-semibold">Solicitar nuevo</span>
        </Link>
        <Link
          to='/auth/login'
          className="block text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
        >
          Volver a Iniciar sesión
        </Link>
      </div>
    </>
  )
}
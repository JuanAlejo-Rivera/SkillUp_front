import { validateToken } from '@/api/AuthApi';
import type { ConfirmToken } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type NewPasswordTokenProps = {
    token: ConfirmToken['token'];
    setToken: React.Dispatch<React.SetStateAction<string>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>

}

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data)
            setIsValidToken(true);
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {//esta linea sirve para actualizar el estado del token cuando el usuario escribe en los campos de entrada
        setToken(token);
    }
    const handleComplete = (token: ConfirmToken['token']) => mutate({ token })// esta linea sirve para enviar el token al servidor, cuando el usuario completa el input de 6 digitos
    return (
        <>
            <div className="p-8 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/20">
                <label className="text-sm font-medium text-gray-300 tracking-wide text-center block mb-6">
                    Código de verificación
                </label>
                <div className="flex justify-center gap-2">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
                        <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
                        <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
                        <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
                        <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
                        <PinInputField className="w-14 h-14 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-2xl font-bold text-white transition-all duration-200 outline-none" />
                    </PinInput>
                </div>
            </div>
            <div className="mt-8 text-center">
                <Link
                    to='/auth/forgot-password'
                    className="block text-gray-400 hover:text-blue-400 font-medium transition-colors duration-200"
                >
                    ¿No recibiste el código? <span className="text-blue-400 font-semibold">Solicitar nuevo</span>
                </Link>
            </div>
        </>
    )
}
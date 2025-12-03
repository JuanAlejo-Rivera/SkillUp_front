import { useState } from 'react'
import type { ConfirmToken } from '@/types/index'
import NewPasswordToken from '@/components/auth/NewPAsswordToken'
import NewPasswordForm from '@/components/auth/NewPasswordForm'

export const NewPasswordView = () => {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)


    return (
        <>
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Nueva contraseña
                </h1>
                <p className="text-lg text-gray-300 font-light">
                    {!isValidToken ? 'Ingresa el código de verificación' : 'Crea tu nueva contraseña'}
                </p>
            </div>
            {!isValidToken ?
                <NewPasswordToken token={token} setToken ={setToken} setIsValidToken = {setIsValidToken} /> :
                <NewPasswordForm token={token} />}
        </>
    )
}

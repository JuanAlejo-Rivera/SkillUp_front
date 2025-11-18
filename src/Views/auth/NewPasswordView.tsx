import { useState } from 'react'
import type { ConfirmToken } from '@/types/index'
import NewPasswordToken from '@/components/auth/NewPAsswordToken'
import NewPasswordForm from '@/components/auth/NewPasswordForm'

export const NewPasswordView = () => {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)


    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer contraseña</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que recibiste {''}
                <span className=" text-gradient font-bold"> por email</span>
            </p>
            {!isValidToken ?
                <NewPasswordToken token={token} setToken ={setToken} setIsValidToken = {setIsValidToken} /> :
                <NewPasswordForm token={token} />}
        </>
    )
}

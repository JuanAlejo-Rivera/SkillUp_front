import api from "@/lib/axios";
import { userSchema, type checkPasswordForm, type ComfirmToken, type ConfirmToken, type ForgotPasswordForm, type NewPasswordForm, type RequestConfirmationCodeForm, type UserLoginForm, type UserRegistrationForm } from "../types";
import { isAxiosError } from "axios";

export async function createAccount(formData: UserRegistrationForm) {
    try {
        const url = '/auth/create-account'
        const { data } = await api.post<string>(url, formData);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}


export async function confirmAccount(formData: ComfirmToken) {
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post<string>(url, formData)
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}


export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}


export async function authenticateUser(formData: UserLoginForm) {
    try {
        const url = '/auth/login'
        const { data } = await api.post<string>(url, formData);
        localStorage.setItem('AUTH_TOKEN', data); // se guarda el token en el localStorage
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password'
        const { data } = await api.post<string>(url, formData);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function validateToken(formData: ConfirmToken) {
    try {

        const url = '/auth/validate-token'
        const { data } = await api.post<string>(url, formData);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error desconocido al iniciar sesión');
    }
}
export async function updatePasswordWithToken({ formData, token }: { formData: NewPasswordForm, token: ConfirmToken['token'] }) {
    try {

        const url = `/auth/update-password/${token}`
        const { data } = await api.post<string>(url, formData);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error desconocido al iniciar sesión');
    }
}

export async function getUser() {
    try {
        const { data } = await api.get('/auth/user');
        const response = userSchema.safeParse(data); // Validamos la respuesta con el esquema
        if (response.success) {
            return response.data;
        } else {
            throw new Error('Error al validar los datos del usuario');
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}

export async function checkPassword(formatData: checkPasswordForm) {
    try {
        const url = `/auth/check-password`
        const { data } = await api.post<string>(url, formatData);
        console.log(data)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw error;
    }
}
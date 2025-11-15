import api from "@/lib/axios";
import type { ComfirmToken, UserRegistrationForm } from "../types";
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
    }
}
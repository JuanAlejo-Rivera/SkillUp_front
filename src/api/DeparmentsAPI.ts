import api from "@/lib/axios"
import type { DepartmentFormData } from "../types"
import { isAxiosError } from "axios"



export async function createDepartment(formData: DepartmentFormData) {
    try {
        const { data } = await api.post('/departments', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
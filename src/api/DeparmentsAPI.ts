import api from "@/lib/axios"
import { dashboardDepartmentSchema, type Department, type DepartmentFormData } from "../types"
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

export async function getDepartments() {
    try {
        const { data } = await api.get('/departments')
        const response = dashboardDepartmentSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteDeparment(departmentId: Department['_id']) {
    try {
        const { data } = await api.delete(`/departments/${departmentId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
    
}
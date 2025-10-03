import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { dashboardSectionSchema, type Course, type SectionFormData } from "../types";

type SectionAPIType = {
    formData: SectionFormData,
    courseId: Course['_id']
}

export async function createSection({ formData, courseId }: SectionAPIType) {
    try {
        const { data } = await api.post(`/courses/${courseId}/sections`, formData)
        console.log('Seccion creada')
        return data
    } catch (error) {

    }
}


export async function getSections(courseId: Course['_id']) {
    try {
        const { data } = await api.get(`/courses/${courseId}/sections`)
        const response = dashboardSectionSchema.safeParse(data)
        console.log(response.data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
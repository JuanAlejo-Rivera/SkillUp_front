import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { dashboardSectionSchema, editSectionSchema, type Course, type Section, type SectionFormData } from "../types";

type SectionAPIType = {
    formData: SectionFormData,
    courseId: Course['_id']
}

export async function createSection({ formData, courseId }: SectionAPIType) {
    try {
        const { data } = await api.post(`/courses/${courseId}/sections`, formData)
        return data
    } catch (error) {

    }
}


export async function getSections(courseId: Course['_id']) {
    try {
        const { data } = await api.get(`/courses/${courseId}/sections`)
        const response = dashboardSectionSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

type GetSectionAPIType = {
    courseId: Course['_id']
    sectionId: Section['_id']
}


export async function getSectionById({ courseId, sectionId }: GetSectionAPIType) {
    try {
        const { data } = await api.get(`/courses/${courseId}/sections/${sectionId}`)
        const response = editSectionSchema.safeParse(data)

        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

type updateSecionAPIType = {
    courseId: Course['_id']
    sectionId: Section['_id']
    formData: SectionFormData
}


export async function updateSection({ courseId, sectionId, formData }: updateSecionAPIType) {
    try {
        const { data } = await api.put(`/courses/${courseId}/sections/${sectionId}`, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteSection({ courseId, sectionId }: GetSectionAPIType) {
    try {
        const { data } = await api.delete(`/courses/${courseId}/sections/${sectionId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

type UpdateSectionsOrderType = {
    courseId: Course['_id']
    sections: { id: string; order: number }[]
}

export async function updateSectionsOrder({ courseId, sections }: UpdateSectionsOrderType) {
    try {
        const { data } = await api.patch(`/courses/${courseId}/sections/order`, { sections })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
import api from "@/lib/axios";
import { LessonSchema, LessonViewSchema, type Course, type Lesson, type LessonFormData } from "../types";
import { isAxiosError } from "axios";


type LessonAPI = {
    courseId: Course['_id']
    sectionId: Course['_id']
    lessonId: Lesson['_id']
    formData: LessonFormData
}

export async function createLesson({ courseId, sectionId, formData }: Pick<LessonAPI, 'courseId' | 'sectionId' | 'formData'>) {
    try {
        const { data } = await api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function getLessons({ courseId, sectionId }: Pick<LessonAPI, 'courseId' | 'sectionId'>) {
    try {
        const { data } = await api.get(`/courses/${courseId}/sections/${sectionId}/lessons`)
        const response = LessonViewSchema.safeParse(data)

        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getLessonById({ courseId, sectionId, lessonId }: Pick<LessonAPI, 'courseId' | 'sectionId' | 'lessonId'>) {
    try {
        const { data } = await api.get(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`)
        const response = LessonSchema.safeParse(data)
        if (response.success) {
            return response.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function updateLesson({ courseId, sectionId, lessonId, formData }: Pick<LessonAPI, 'formData' | 'courseId' | 'sectionId' | 'lessonId'>) {
    try {
        const { data } = await api.put(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteLesson({ courseId, sectionId, lessonId }: Pick<LessonAPI, 'lessonId' | 'courseId' | 'sectionId'>) {
    try {
        const { data } = await api.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}
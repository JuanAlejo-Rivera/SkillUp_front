import { dashboardCourseSchema, edictCourseSchema } from './../types/index';
import { isAxiosError } from "axios";
import type { Course, CourseFormData } from "@/types/index";
import api from "@/lib/axios";

export async function createCourse(formData: CourseFormData) {
    try {
        const { data } = await api.post('/courses', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function getCourses() {

    try {
        const { data } = await api.get('/courses')
        const response = dashboardCourseSchema.safeParse(data)
        if (response.success) {
            return response.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getCourseById(id: Course['_id']) {
    try {
        const { data } = await api.get(`/courses/${id}`)
        const response = edictCourseSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {

    }

}

type CourseAPIType = {
    formData: CourseFormData,
    courseId: Course['_id']
}

export async function updateCourse({ formData, courseId }: CourseAPIType) {
    try {
        const { data } = await api.put(`/courses/${courseId}`, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export async function deleteCorse(courseId: Course['_id']) {
    try {
        const { data } = await api.delete(`/courses/${courseId}`)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}


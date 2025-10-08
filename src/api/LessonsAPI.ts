import api from "@/lib/axios";
import type { Course, Lesson } from "../types";
import { isAxiosError } from "axios";


type CreateLessonAPIType = {
    courseId: Course['_id']
    sectionId: Course['_id']
    formData: Lesson
}

export async function createLesson({ courseId, sectionId, formData }: CreateLessonAPIType) {
    try {
        const { data } = await api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
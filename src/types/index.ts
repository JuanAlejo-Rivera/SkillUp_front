import { z } from "zod"

/** Courses */
export const courseSchema = z.object({
    _id: z.string(),
    courseName: z.string(),
    description: z.string(),
    department: z.string()
})

export const dashboardCourseSchema = z.array(
    courseSchema.pick({
        _id: true,
        courseName: true,
        description: true,
        department: true
    })
)

export const edictCourseSchema = courseSchema.pick({
    courseName: true,
    description: true,
    department: true
})


export type Course = z.infer<typeof courseSchema>
export type CourseFormData = Pick<Course, "courseName" | "description" | "department">
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


/** Sections */

export const sectionShema = z.object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
})


export const dashboardSectionSchema = z.array(
    sectionShema.pick({
        _id: true,
        title: true,
        description: true,
    })
)

export const editSectionSchema = sectionShema.pick({
    _id: true,
    title: true,
    description: true,
})

export type Section = z.infer<typeof sectionShema>
export type SectionFormData = Pick<Section, "title" | "description">

/** Lessons */

export const LessonSchema = z.object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    videoUrl: z.string(),
    fileUrl: z.string(),
    imageUrl: z.string()
})


export const LessonViewSchema = z.array(
    LessonSchema.pick({
        _id: true,
        title: true,
        description: true,
        videoUrl: true,
        fileUrl: true,
        imageUrl: true
    })
)


export type Lesson = z.infer<typeof LessonSchema>
export type LessonFormData = Pick<Lesson, "_id" | "title" | "description" | "videoUrl" | "fileUrl" | "imageUrl">
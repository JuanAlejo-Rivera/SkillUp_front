import { z } from "zod"


/** Auth & user */
const authSchema = z.object({
    name: z.string(),
    email: z.email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, "email" | "password">
export type UserRegistrationForm = Pick<Auth, "name" | "email" | "password" | "password_confirmation">
export type ComfirmToken = Pick<Auth, "token">
export type RequestConfirmationCodeForm = Pick<Auth, "email">
export type ForgotPasswordForm = Pick<Auth, "email">
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>

/** Users */
//de esta manera usarmos solo los campos que necesitamos de authSchema
export const userSchema = authSchema.pick({
    name: true,
    email: true,
}).extend({//agregamos atrributos adicionales
    _id: z.string(),
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'> //lo que se espera de un formulario para editar el perfil del usuario


/** Courses */
export const departmentPopulatedSchema = z.object({
    _id: z.string(),
    departmentName: z.string(),
})

export const courseFormSchema = z.object({
    courseName: z.string(),
    description: z.string(),
    department: z.union([
        z.string(),
        z.object({
            _id: z.string(),
            departmentName: z.string(),
        }),
    ]).nullable(),
})

// Schema para el manager poblado
export const managerSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
})

export const courseSchema = z.object({
    _id: z.string(),
    courseName: z.string(),
    description: z.string(),
    department: departmentPopulatedSchema.nullable(),
    manager: z.union([
        z.string(),
        managerSchema
    ])
})

// Schema específico para el dashboard donde manager siempre viene poblado
export const dashboardCourseSchema = z.array(
    z.object({
        _id: z.string(),
        courseName: z.string(),
        description: z.string(),
        department: departmentPopulatedSchema.nullable(),
        manager: managerSchema,
    })
)

export const edictCourseSchema = courseSchema.pick({
    courseName: true,
    description: true,
    department: true,
}).extend({
    department: z.union([
        z.string(), // cuando solo viene el ID
        departmentPopulatedSchema.nullable() // cuando viene poblado
    ])
});


export type Course = z.infer<typeof courseSchema>
export type CourseFormData = z.infer<typeof courseFormSchema>


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
    videoUrl: z.array(z.string()),
    fileUrl: z.array(z.string()),
    imageUrl: z.array(z.string()),
});



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

/** Departments */

export const departmentSchema = z.object({
    _id: z.string(),
    departmentName: z.string(),
})

export const dashboardDepartmentSchema = z.array(
    departmentSchema.pick({
        _id: true,
        departmentName: true,
    })
)
export type Department = z.infer<typeof departmentSchema>
export type DepartmentFormData = Pick<Department, "departmentName">
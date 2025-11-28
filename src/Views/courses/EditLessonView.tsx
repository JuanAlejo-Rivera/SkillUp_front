import { getLessonById } from "@/api/LessonsAPI"
import { getCourseById } from "@/api/CoursesAPI"
import EditLessonForm from "@/components/lessons/EditLessonForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import { useAuth } from "@/hooks/UserAuth"
import { canModify } from "../../utils/policies"
import ReactSpinner from "@/components/ReactSpinner/ReactSpinner";

export const EditLessonView = () => {

    const { data: user, isLoading: authLoading } = useAuth()
    const location = useLocation()
    const courseName = location.state?.courseName;
    
    const params = useParams()
    const sectionId = params.sectionId!
    const courseId = params.courseId!
    const lessonId = params.lessonId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editLesson', lessonId],
        queryFn: () => getLessonById({sectionId, courseId, lessonId}),
        retry: false
    })

    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        retry: false
    })

    if (isLoading && authLoading && courseLoading) return <ReactSpinner />
    if (isError) return <Navigate to={'/404'} />
    
    // Verificar si el usuario tiene permisos para editar (admin o manager)
    if (course && user && !canModify(user, course.manager)) {
        return <Navigate to={'/'} />
    }
    
    if (data) return <EditLessonForm data={data} courseId={courseId} sectionId = {sectionId} lessonId = {lessonId} courseName={courseName}/>

}


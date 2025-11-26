import { getCourseById } from "@/api/CoursesAPI"
import EditCourseForm from "@/components/courses/EditCourseForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import { useAuth } from "@/hooks/UserAuth"
import { canModify } from "../../utils/policies"

export default function EditCourseView() {

    const { data: user, isLoading: authLoading } = useAuth()
    const params = useParams()
    const courseId = params.courseId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editCourse', courseId],
        queryFn: () => getCourseById(courseId),
        retry: false
    })

    if (isLoading && authLoading) return 'Cargando...'
    if (isError) return <Navigate to={'/404'} />
    
    // Verificar si el usuario tiene permisos para editar (admin o manager)
    if (data && user && !canModify(user, data.manager)) {
        return <Navigate to={'/'} />
    }
    
    if (data) return <EditCourseForm data={data} courseId={courseId} />
}

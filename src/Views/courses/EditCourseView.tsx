import { getCourseById } from "@/api/CoursesAPI"
import EditCourseForm from "@/components/courses/EditCourseForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

export default function EditCourseView() {

    const params = useParams()
    const courseId = params.courseId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editCourse', courseId],
        queryFn: () => getCourseById(courseId),
        retry: false
    })

    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditCourseForm data={data} courseId={courseId} />
}

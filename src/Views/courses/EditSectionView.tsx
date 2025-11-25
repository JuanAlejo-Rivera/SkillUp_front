import { getSectionById } from "@/api/SectionAPI"
import { getCourseById } from "@/api/CoursesAPI"
import EditSectionForm from "@/components/sections/EditSectionForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import { useAuth } from "@/hooks/UserAuth"
import { isManager } from "../../utils/policies"

export const EditSectionView = () => {

    const { data: user, isLoading: authLoading } = useAuth()
    const location = useLocation()
    const courseName = location.state?.courseName;

    
    const params = useParams()
    const sectionId = params.sectionId!
    const courseId = params.courseId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editSection', sectionId],
        queryFn: () => getSectionById({sectionId, courseId}),
        retry: false
    })

    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        retry: false
    })

    if (isLoading && authLoading && courseLoading) return 'Cargando...'
    if (isError) return <Navigate to={'/404'} />
    
    // Verificar si el usuario es el manager del curso
    if (course && user && !isManager(course.manager, user._id)) {
        return <Navigate to={'/'} />
    }
    
    if (data) return <EditSectionForm data={data} courseId={courseId} sectionId = {sectionId} courseName={courseName}/>

}


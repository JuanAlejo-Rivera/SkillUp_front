import { getLessonById } from "@/api/LessonsAPI"
import EditLessonForm from "@/components/lessons/EditLessonForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"

export const EditLessonView = () => {

    const location = useLocation()
    const courseName = location.state?.courseName;
    
    const params = useParams()
    const sectionId = params.sectionId!
    const courseId = params.courseId!
    const lessonId = params.lessonId!

    // console.log(courseName)
    const { data, isLoading, isError } = useQuery({
        queryKey: ['editLesson', lessonId],
        queryFn: () => getLessonById({sectionId, courseId, lessonId}),
        retry: false
    })

    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditLessonForm data={data} courseId={courseId} sectionId = {sectionId} lessonId = {lessonId} courseName={courseName}/>
    // if (data) return <EditSectionForm/>

}


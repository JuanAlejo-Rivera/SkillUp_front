import { getLessonById } from "@/api/LessonsAPI"
import EditLessonForm from "@/components/lessons/EditLessonForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

export const EditLessonView = () => {

    
    const params = useParams()
    const sectionId = params.sectionId!
    const courseId = params.courseId!
    const lessonId = params.lessonId!
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['editLesson', lessonId],
        queryFn: () => getLessonById({sectionId, courseId, lessonId}),
        retry: false
    })


    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditLessonForm data={data} courseId={courseId} sectionId = {sectionId} lessonId = {lessonId}/>
    // if (data) return <EditSectionForm/>

}


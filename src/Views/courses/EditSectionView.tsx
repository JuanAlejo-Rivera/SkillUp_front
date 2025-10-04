import { getSectionById } from "@/api/SectionAPI"
import EditSectionForm from "@/components/sections/EditSectionForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

export const EditSectionView = () => {

    
    const params = useParams()
    const sectionId = params.sectionId!
    const courseId = params.courseId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editSection', sectionId],
        queryFn: () => getSectionById({sectionId, courseId}),
        retry: false
    })


    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditSectionForm data={data} courseId={courseId} sectionId = {sectionId}/>
    // if (data) return <EditSectionForm/>

}


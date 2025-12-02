import { getSections, updateSectionsOrder } from "@/api/SectionAPI"
import { getCourseById } from "@/api/CoursesAPI"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import BackButton from "@/components/arrowBack/backButton"
import { useAuth } from "@/hooks/UserAuth"
import { canModify, isAdmin, isTeacher } from "../../utils/policies"
import ReactSpinner from "@/components/ReactSpinner/ReactSpinner"
import DeleteSectionModal from "@/components/sections/DeleteSection"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Section } from "@/types/index";
import SortableSectionItem from "@/components/sections/SortableSectionItem";

export const SectionsView = () => {

  const { data: user, isLoading: authLoading } = useAuth()

  const params = useParams()
  const courseId = params.courseId!

  const location = useLocation();
  const courseName = location.state?.courseName;
  const queryClient = useQueryClient()

  const [sections, setSections] = useState<Section[]>([])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sections'],
    queryFn: () => getSections(courseId),
    retry: false
  })

  // Sincronizar el estado local con los datos del query
  useEffect(() => {
    if (data) {
      setSections(data)
    }
  }, [data])

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    retry: false
  })

  const updateOrderMutation = useMutation({
    mutationFn: updateSectionsOrder,
    onError: (error) => {
      toast.error(error.message)
      // Revertir el cambio en caso de error
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id)
        const newIndex = items.findIndex((item) => item._id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Actualizar el orden en el backend
        const sectionsOrder = newItems.map((item, index) => ({
          id: item._id,
          order: index
        }))

        updateOrderMutation.mutate({ courseId, sections: sectionsOrder })

        return newItems
      })
    }
  }

  // console.log(course?.manager)

  if (isError) return <Navigate to={'/404'} />
  if (isLoading && authLoading && courseLoading) return <ReactSpinner />

  if (data && user && course) return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-4">
            <BackButton
              to={`/`}
              title="Volver a cursos"
              position=""
              state={{ courseName: courseName }}
            />
          </div>

          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-6 mb-8 shadow-xl border-2 border-blue-600">
            <h6 className="text-3xl font-black text-white drop-shadow-lg mb-2">
              📚 {courseName}
            </h6>
            <p className="text-blue-200 text-sm">Curso activo</p>
          </div>

          <h1 className="text-4xl font-black text-white mb-3">Mis secciones</h1>
          {(isAdmin(user) || isTeacher(user)) && (
            <p className="text-lg font-light text-gray-300 mb-8">Maneja y administra tus secciones</p>
          )}

          <nav className="my-8 flex flex-wrap gap-4">
            {canModify(user, course.manager) && (
              <Link
                className="btn-primary-action"
                state={{ courseId, courseName }}
                to={'/create-section'}
              >
                Nueva sección
              </Link>
            )}

          </nav>

          {sections.length ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  {sections.map((section) => (
                    <SortableSectionItem
                      key={section._id}
                      section={section}
                      courseId={courseId}
                      courseName={courseName}
                      user={user}
                      course={course}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

          ) : (
            <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-12 border-2 border-dashed border-gray-300 rounded-2xl">
              <p className="text-gray-600 text-lg font-semibold">No hay secciones disponibles</p>
            </div>
          )}
          <DeleteSectionModal />
        </div>
      </div>
    </>
  )
}
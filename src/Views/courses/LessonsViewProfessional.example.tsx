// 🎨 EJEMPLO DE INTEGRACIÓN COMPLETA CON UI PROFESIONAL
// Este archivo muestra cómo integrar los componentes mejorados en LessonsView

import { deleteLesson, getLessons, updateLesson } from "@/api/LessonsAPI";
import ModalLessonAdd from "@/components/lessons/ModalLessonAdd";
import UploadFile from "@/components/UploadCloudinary";
import LessonMediaViewer from "@/components/LessonMediaViewer";
import { deleteFileFromLesson } from "@/api/FilesAPI";
import type { LessonFormData } from "@/types/index";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { 
  EllipsisVerticalIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  SparklesIcon
} from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";

export const LessonsViewProfessional = () => {
  const location = useLocation();
  const courseName = location.state?.courseName;
  const navigate = useNavigate();
  
  const params = useParams();
  const courseId = params.courseId!;
  const sectionId = params.sectionId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => getLessons({ courseId, sectionId }),
    retry: false,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteLesson,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("🗑️ " + data);
    },
  });

  const [pendingUpdates, setPendingUpdates] = useState<Record<string, {
    videoUrl?: string[];
    imageUrl?: string[];
    fileUrl?: string[];
  }>>({});

  const [resetTrigger, setResetTrigger] = useState(false);

  const updateLessonMutation = useMutation({
    mutationFn: updateLesson,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success("✅ " + data);
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setResetTrigger(true);
      setTimeout(() => setResetTrigger(false), 200);
    }
  });

  const handleUpdateForm = async (lessonId: string, formData: LessonFormData) => {
    const data = { formData, courseId, sectionId, lessonId };
    await updateLessonMutation.mutateAsync(data);
  };

  const handleDeleteFile = async (lessonId: string, url: string, fileType: 'video' | 'image' | 'file') => {
    try {
      await deleteFileFromLesson(sectionId, lessonId, url, fileType);
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando lecciones...</p>
        </div>
      </div>
    );
  }
  
  if (isError) return <Navigate to={'/404'} />;

  if (data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Mejorado */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h6 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  {courseName}
                </h6>
                <h1 className="text-4xl font-black text-gray-900">Mis Lecciones</h1>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              Gestiona el contenido multimedia y las lecciones de tu curso con facilidad
            </p>
          </div>

          {/* Botones de Acción */}
          <nav className="mb-10 flex flex-wrap gap-4">
            <button
              type="button"
              className="btn-gradient-primary flex items-center gap-2"
              onClick={() =>
                navigate(location.pathname + `?addLesson=true`, {
                  state: { courseName },
                })
              }
            >
              <CheckCircleIcon className="w-5 h-5" />
              Agregar Nueva Lección
            </button>

            <Link
              className="bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              to={`/courses/${courseId}/sections`}
              state={{ courseName: courseName }}
            >
              ← Regresar a Secciones
            </Link>
          </nav>

          {/* Lista de Lecciones */}
          {data.length ? (
            <ul className="space-y-8">
              {data.map((lesson, index) => (
                <li
                  key={lesson._id}
                  className="lesson-card bg-white rounded-3xl shadow-professional-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header de la Lección */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-2xl">
                          <span className="text-2xl font-black text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </h2>
                          <p className="text-gray-600 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menú de Opciones Mejorado */}
                    <Menu as="div" className="relative">
                      <MenuButton className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none overflow-hidden">
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to={`/courses/${courseId}/sections/${sectionId}/lesson/${lesson._id}/edit`}
                                state={{ courseName }}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <PencilIcon className="w-5 h-5" />
                                Editar Lección
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => mutate({ courseId, sectionId, lessonId: lesson._id })}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                                  active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                }`}
                              >
                                <TrashIcon className="w-5 h-5" />
                                Eliminar Lección
                              </button>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>

                  <div className="separation_line_lessons" />

                  {/* Sección de Carga de Archivos */}
                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-blue-500" />
                      Subir Contenido Nuevo
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Upload Videos */}
                      <UploadFile
                        label="Videos"
                        accept="video/*"
                        multiple
                        onUploadComplete={(urls) =>
                          setPendingUpdates((prev) => ({
                            ...prev,
                            [lesson._id]: {
                              ...prev[lesson._id],
                              videoUrl: Array.from(
                                new Set([...(prev[lesson._id]?.videoUrl || []), ...urls])
                              ),
                            },
                          }))
                        }
                        resetTrigger={resetTrigger}
                      />

                      {/* Upload Imágenes */}
                      <UploadFile
                        label="Imágenes"
                        accept="image/*"
                        multiple
                        onUploadComplete={(urls) =>
                          setPendingUpdates((prev) => ({
                            ...prev,
                            [lesson._id]: {
                              ...prev[lesson._id],
                              imageUrl: [...(prev[lesson._id]?.imageUrl || []), ...urls],
                            },
                          }))
                        }
                        resetTrigger={resetTrigger}
                      />

                      {/* Upload Archivos */}
                      <UploadFile
                        label="Documentos"
                        accept=".pdf,.doc,.docx,.xlsx,.pptx"
                        multiple
                        onUploadComplete={(urls) =>
                          setPendingUpdates((prev) => ({
                            ...prev,
                            [lesson._id]: {
                              ...prev[lesson._id],
                              fileUrl: [...(prev[lesson._id]?.fileUrl || []), ...urls],
                            },
                          }))
                        }
                        resetTrigger={resetTrigger}
                      />
                    </div>
                  </div>

                  <div className="separation_line_lessons" />

                  {/* Visualizador de Archivos Existentes */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-purple-500" />
                      Archivos de la Lección
                    </h3>
                    <LessonMediaViewer
                      videoUrls={lesson.videoUrl}
                      imageUrls={lesson.imageUrl}
                      fileUrls={lesson.fileUrl}
                      onDeleteFile={(url, type) => handleDeleteFile(lesson._id, url, type)}
                      canDelete={true}
                    />
                  </div>

                  {/* Botón de Guardar Cambios */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleUpdateForm(lesson._id, {
                          ...lesson,
                          ...(pendingUpdates[lesson._id] || {}),
                        })
                      }
                      disabled={updateLessonMutation.isPending}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        updateLessonMutation.isPending
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'btn-gradient-primary'
                      }`}
                    >
                      {updateLessonMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-professional">
              <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl mb-6">
                <SparklesIcon className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No hay lecciones todavía
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza creando tu primera lección para este curso
              </p>
              <button
                onClick={() => navigate(location.pathname + `?addLesson=true`, { state: { courseName } })}
                className="btn-gradient-primary inline-flex items-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Crear Primera Lección
              </button>
            </div>
          )}

          <ModalLessonAdd />
        </div>
      </div>
    );
  }
};
import { deleteLesson, getLessons, updateLesson, updateLessonsOrder, deleteFile } from "@/api/LessonsAPI";
import { getCourseById } from "@/api/CoursesAPI";
import ModalLessonAdd from "@/components/lessons/ModalLessonAdd";
import UploadFile from "@/components/UploadCloudinary";
import type { LessonFormData, Lesson } from "@/types/index";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, DocumentTextIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";
import BackButton from "@/components/arrowBack/backButton";
import { useAuth } from "@/hooks/UserAuth";
import { canModify, isAdmin, isTeacher } from "../../utils/policies";
import ReactSpinner from "@/components/ReactSpinner/ReactSpinner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableLessonWrapper from "@/components/lessons/SortableLessonWrapper";


export const LessonsView = () => {

  const { data: user, isLoading: authLoading } = useAuth()

  const location = useLocation()
  const courseName = location.state?.courseName;


  const navigate = useNavigate();

  const params = useParams();
  const courseId = params.courseId!;
  const sectionId = params.sectionId!;

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => getLessons({ courseId, sectionId }),
    retry: false,
  });

  // Sincronizar el estado local con los datos del query
  useEffect(() => {
    if (data) {
      setLessons(data);
    }
  }, [data]);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    retry: false
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteLesson,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success(data);
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
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['editLesson'] })
      queryClient.invalidateQueries({ queryKey: ['editSection'] })
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    }
  })

  const handleUpdateForm = async (lessonId: string, formData: LessonFormData) => {
    const data = { formData, courseId, sectionId, lessonId };
    await updateLessonMutation.mutateAsync(data);

    setResetTrigger(true);
    setTimeout(() => setResetTrigger(false), 200); // se apaga el trigger
  };

  const updateLessonsOrderMutation = useMutation({
    mutationFn: updateLessonsOrder,
    onError: (error) => {
      toast.error(error.message);
      // Revertir el cambio en caso de error
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  const handleDeleteFile = (lessonId: string, fileUrl: string, fileType: 'videoUrl' | 'fileUrl' | 'imageUrl') => {
    if (confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      deleteFileMutation.mutate({ courseId, sectionId, lessonId, fileUrl, fileType });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Actualizar el orden en el backend
        const lessonsOrder = newItems.map((item, index) => ({
          id: item._id,
          order: index,
        }));

        updateLessonsOrderMutation.mutate({ courseId, sectionId, lessons: lessonsOrder });

        return newItems;
      });
    }
  };

  if (isLoading && authLoading && courseLoading) return <ReactSpinner />;
  if (isError) return <Navigate to={'/404'} />

  if (data && user && course)
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="mb-4">
              <BackButton
                to={`/courses/${courseId}/sections`}
                title="Volver a secciones"
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

            <h1 className="text-4xl font-black text-white mb-3">Mis lecciones</h1>
            {(isAdmin(user) || isTeacher(user)) && (
              <p className="text-lg font-light text-gray-300 mb-8">Maneja y administra las lecciones de la sección</p>
            )}

            <nav className="my-8 flex flex-wrap gap-4">
              {canModify(user, course.manager) && (
                <button
                  type="button"
                  className="btn-primary-action"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() =>
                    navigate(location.pathname + `?addLesson=true`, {
                      state: { courseName },
                    })
                  }
                >
                  Agregar nueva lección
                </button>
              )}

            </nav>

            {lessons.length ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={lessons.map((l) => l._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="mt-10 space-y-8">
                    {lessons.map((lessonsItem) => (
                      <SortableLessonWrapper
                        key={lessonsItem._id}
                        id={lessonsItem._id}
                        canDrag={canModify(user, course.manager)}
                      >
                        <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl shadow-xl border-2 border-blue-700/50 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 p-8"
                        >
                          {/* --- Encabezado --- */}
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                              <h2 className="text-white text-3xl font-bold mb-3">
                                {lessonsItem.title}
                              </h2>
                              <p className="text-base text-gray-300 leading-relaxed">{lessonsItem.description}</p>
                            </div>

                            {/* --- Menú de opciones --- */}
                            <Menu as="div" className="relative flex-none ml-4 z-[100]" onPointerDown={(e) => e.stopPropagation()}>
                              <MenuButton className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                                <span className="sr-only">opciones</span>
                                <EllipsisVerticalIcon className="h-7 w-7 text-white hover:text-blue-200" aria-hidden="true" />
                              </MenuButton>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <MenuItems className="dropdown-menu">
                                  {canModify(user, course.manager) && (
                                    <>
                                      <MenuItem>
                                        <Link
                                          to={`/courses/${courseId}/sections/${sectionId}/lesson/${lessonsItem._id}/edit`}
                                          className="dropdown-item"
                                          state={{ courseName: courseName }}
                                        >
                                          Editar Lección
                                        </Link>
                                      </MenuItem>
                                      <MenuItem>
                                        <button
                                          type="button"
                                          className="dropdown-item-danger w-full text-left"
                                          onClick={() =>
                                            mutate({ courseId, sectionId, lessonId: lessonsItem._id })
                                          }
                                        >
                                          Eliminar Lección
                                        </button>
                                      </MenuItem>
                                    </>
                                  )}
                                </MenuItems>
                              </Transition>
                            </Menu>
                          </div>

                          <div className="separation_line_lessons" />

                          {/* contenido de video */}
                          <div className="flex flex-col gap-8">
                            {/* subir y mostrar archivos multimedia */}
                            {canModify(user, course.manager) && (
                              <div className="upload-area p-6">
                                <UploadFile
                                  label="Video"
                                  accept="video/*"
                                  multiple
                                  onUploadComplete={(urls) =>
                                    setPendingUpdates((prev) => ({
                                      ...prev,
                                      [lessonsItem._id]: {
                                        ...prev[lessonsItem._id],
                                        videoUrl: Array.from(
                                          new Set([...(prev[lessonsItem._id]?.videoUrl || []), ...urls])
                                        ),
                                      },
                                    }))
                                  }
                                  resetTrigger={resetTrigger}
                                />
                              </div>
                            )}

                            {Array.isArray(lessonsItem.videoUrl) && lessonsItem.videoUrl.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {lessonsItem.videoUrl.map((url) => (
                                  <div key={url} className="relative group">
                                    <video
                                      src={url}
                                      controls
                                      className="w-200 h-90 rounded-2xl border-2 border-gray-300 shadow-lg"
                                    />
                                    {canModify(user, course.manager) && (
                                      <button
                                        type="button"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={() => handleDeleteFile(lessonsItem._id, url, 'videoUrl')}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        title="Eliminar video"
                                      >
                                        <XMarkIcon className="h-5 w-5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-8 border-2 border-dashed border-gray-300 rounded-2xl">
                                <p className="text-lg font-semibold text-gray-600">No hay videos disponibles en esta lección</p>
                              </div>
                            )}

                            <div className="separation_line_lessons" />
                            {/* Subir y mostrar imagenes */}
                            {canModify(user, course.manager) && (
                              <div className="upload-area p-6">
                                <UploadFile
                                  label="Imagen"
                                  accept="image/*"
                                  multiple
                                  onUploadComplete={(urls) =>
                                    setPendingUpdates((prev) => ({
                                      ...prev,
                                      [lessonsItem._id]: {
                                        ...prev[lessonsItem._id],
                                        imageUrl: [...(prev[lessonsItem._id]?.imageUrl || []), ...urls],
                                      },
                                    }))
                                  }
                                  resetTrigger={resetTrigger}
                                />
                              </div>
                            )}

                            {Array.isArray(lessonsItem.imageUrl) && lessonsItem.imageUrl.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {lessonsItem.imageUrl.map((url) => (
                                  <div key={`${lessonsItem._id}-${url}`} className="relative group">
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                    >
                                      <img
                                        src={url}
                                        alt="Imagen subida"
                                        className="w-full h-48 object-cover rounded-2xl border-2 border-gray-300 shadow-md group-hover:scale-105 group-hover:shadow-xl transition-all duration-300"
                                      />
                                    </a>
                                    {canModify(user, course.manager) && (
                                      <button
                                        type="button"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={() => handleDeleteFile(lessonsItem._id, url, 'imageUrl')}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                        title="Eliminar imagen"
                                      >
                                        <XMarkIcon className="h-5 w-5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-8 border-2 border-dashed border-gray-300 rounded-2xl">
                                <p className="text-lg font-semibold text-gray-600">No hay imágenes disponibles en esta lección</p>
                              </div>
                            )}

                            <div className="separation_line_lessons" />
                            {/* Subir y mostrar archivos */}
                            {canModify(user, course.manager) && (
                              <div className="upload-area p-6">
                                <UploadFile
                                  label="Archivos"
                                  accept=".pdf,.doc,.docx,.xlsx,.pptx"
                                  multiple
                                  onUploadComplete={(urls) =>
                                    setPendingUpdates((prev) => ({
                                      ...prev,
                                      [lessonsItem._id]: {
                                        ...prev[lessonsItem._id],
                                        fileUrl: [...(prev[lessonsItem._id]?.fileUrl || []), ...urls],
                                      },
                                    }))
                                  }
                                  resetTrigger={resetTrigger}
                                />
                              </div>
                            )}

                            {Array.isArray(lessonsItem.fileUrl) && lessonsItem.fileUrl.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {lessonsItem.fileUrl.map((fileUrl: string, index: number) => {
                                  const fileName = decodeURIComponent(fileUrl.split("/").pop() || "");
                                  const isPDF = fileUrl.toLowerCase().endsWith(".pdf");
                                  const isWord = fileUrl.toLowerCase().match(/\.(doc|docx)$/i);

                                  // si es pdf o word, cambia la url para descarga
                                  const downloadUrl =
                                    isPDF || isWord
                                      ? fileUrl.replace("/upload/", "/upload/fl_attachment/")
                                      : fileUrl;

                                  return (
                                    <div key={index} className="relative group">
                                      <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:border-blue-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
                                      >
                                        {isPDF ? (
                                          <div className="relative w-16 h-16 mb-2">
                                            <DocumentTextIcon className="w-16 h-16 text-red-600" />
                                            <span className="absolute top-4 left-4 text-white font-bold text-xs bg-red-600 px-1 rounded">
                                              PDF
                                            </span>
                                          </div>
                                        ) : isWord ? (
                                          <div className="relative w-16 h-16 mb-2">
                                            <DocumentTextIcon className="w-16 h-16 text-blue-700" />
                                            <span className="absolute top-4 left-5 text-white font-bold text-xs bg-blue-700 px-1 rounded">
                                              W
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="relative w-16 h-16 mb-2">
                                            <DocumentTextIcon className="w-16 h-16 text-gray-600" />
                                          </div>
                                        )}

                                        <span className="text-sm text-blue-700 font-semibold mt-2">Abrir</span>
                                        <span className="text-xs text-gray-500 truncate w-full text-center mt-1">
                                          {fileName}
                                        </span>
                                      </a>
                                      {canModify(user, course.manager) && (
                                        <button
                                          type="button"
                                          onPointerDown={(e) => e.stopPropagation()}
                                          onClick={() => handleDeleteFile(lessonsItem._id, fileUrl, 'fileUrl')}
                                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                          title="Eliminar archivo"
                                        >
                                          <XMarkIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-8 border-2 border-dashed border-gray-300 rounded-2xl">
                                <p className="text-lg font-semibold text-gray-600">No hay archivos disponibles en esta lección</p>
                              </div>
                            )}

                          </div>
                          {canModify(user, course.manager) && (
                            <div className="flex justify-end mt-8 pt-6 border-t-2 border-gray-200">
                              <button
                                type="button"
                                disabled={updateLessonMutation.isPending}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() =>
                                  handleUpdateForm(lessonsItem._id, {
                                    ...lessonsItem,
                                    ...(pendingUpdates[lessonsItem._id] || {}),
                                  })
                                }
                                className={`px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 ${updateLessonMutation.isPending
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 hover:scale-105 hover:shadow-xl"
                                  }`}
                              >
                                {updateLessonMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                              </button>
                            </div>
                          )}
                        </div>
                      </SortableLessonWrapper>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center bg-gradient-to-br from-gray-50 to-slate-100 p-12 border-2 border-dashed border-gray-300 rounded-2xl">
                <p className="text-gray-600 text-lg font-semibold">No hay lecciones creadas</p>
              </div>
            )}

            <ModalLessonAdd />
          </div>
        </div>
      </>
    );
};

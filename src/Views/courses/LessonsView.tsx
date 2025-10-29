import { deleteLesson, getLessons, updateLesson } from "@/api/LessonsAPI";
import ModalLessonAdd from "@/components/lessons/ModalLessonAdd";
import UploadFile from "@/components/UploadCloudinary";
import LessonMediaViewer from "@/components/LessonMediaViewer";
import { deleteFileFromLesson } from "@/api/FilesAPI";
import type { LessonFormData } from "@/types/index";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";

export const LessonsView = () => {

  const location = useLocation()
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

  const handleDeleteFile = async (lessonId: string, url: string, fileType: 'video' | 'image' | 'file') => {
    try {
      await deleteFileFromLesson(lessonId, url, fileType);
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('🗑️ Archivo eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error al eliminar archivo');
    }
  };





  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to={'/404'} />

  if (data)
    return (
      <>
        <div className="max-w-4xl mx-auto px-4">
          <h6 className="text-2xl font-semibold italic text-sky-600 drop-shadow-sm mb-5">
            {courseName}
          </h6>

          <h1 className="text-2xl font-black text-slate-800">Mis lecciones</h1>
          <p className="text-lg font-light text-gray-500 mt-2">
            Maneja y administra las lecciones de la sección
          </p>

          <nav className="my-6 flex flex-col md:flex-row gap-3">
            <button
              type="button"
              className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
              onClick={() =>
                navigate(location.pathname + `?addLesson=true`, {
                  state: { courseName },
                })
              }
            >
              Agregar nueva lección
            </button>

            <Link
              className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
              to={`/courses/${courseId}/sections`}
              state={{ courseName: courseName }}
            >
              Regresar a secciones
            </Link>
          </nav>

          {data.length ? (
            <ul
              role="list"
              className="mt-10 space-y-6"
            >
              {data.map((lessons) => (
                <li
                  key={lessons._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  {/* --- Encabezado --- */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link
                        to={`/projects/${lessons._id}`}
                        className="text-gray-800 hover:text-sky-700 cursor-pointer hover:underline text-2xl font-bold"
                      >
                        {lessons.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-8 mb-2">{lessons.description}</p>
                    </div>


                    {/* --- Menú de opciones --- */}
                    <Menu as="div" className="relative flex-none">
                      <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
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
                        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <MenuItem>
                            <Link
                              to={`/courses/${courseId}/sections/${sectionId}/lesson/${lessons._id}/edit`}
                              className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                              state ={{courseName: courseName}}
                            >
                              Editar Lección
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type="button"
                              className="block w-full text-left px-3 py-1 text-sm leading-6 text-red-500 hover:bg-red-50"
                              onClick={() =>
                                mutate({ courseId, sectionId, lessonId: lessons._id })
                              }
                            >
                              Eliminar Lección
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>

                  <div className="separation_line_lessons" />

                  {/* contenido de video */}
                  <div className="flex flex-col gap-4">
                    {/* subir archivos multimedia */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        ✨ Subir Contenido Nuevo
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Subir Videos */}
                        <UploadFile
                          label="Videos"
                          accept="video/*"
                          multiple
                          onUploadComplete={(urls) =>
                            setPendingUpdates((prev) => ({
                              ...prev,
                              [lessons._id]: {
                                ...prev[lessons._id],
                                videoUrl: Array.from(
                                  new Set([...(prev[lessons._id]?.videoUrl || []), ...urls])
                                ),
                              },
                            }))
                          }
                          resetTrigger={resetTrigger}
                        />

                        {/* Subir Imágenes */}
                        <UploadFile
                          label="Imágenes"
                          accept="image/*"
                          multiple
                          onUploadComplete={(urls) =>
                            setPendingUpdates((prev) => ({
                              ...prev,
                              [lessons._id]: {
                                ...prev[lessons._id],
                                imageUrl: [...(prev[lessons._id]?.imageUrl || []), ...urls],
                              },
                            }))
                          }
                          resetTrigger={resetTrigger}
                        />

                        {/* Subir Documentos */}
                        <UploadFile
                          label="Documentos"
                          accept=".pdf,.doc,.docx,.xlsx,.pptx"
                          multiple
                          onUploadComplete={(urls) =>
                            setPendingUpdates((prev) => ({
                              ...prev,
                              [lessons._id]: {
                                ...prev[lessons._id],
                                fileUrl: [...(prev[lessons._id]?.fileUrl || []), ...urls],
                              },
                            }))
                          }
                          resetTrigger={resetTrigger}
                        />
                      </div>
                    </div>

                    <div className="separation_line_lessons" />

                    {/* Visualizador de Archivos Existentes con opción de eliminar */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📁 Archivos de la Lección
                      </h3>
                      <LessonMediaViewer
                        videoUrls={lessons.videoUrl}
                        imageUrls={lessons.imageUrl}
                        fileUrls={lessons.fileUrl}
                        onDeleteFile={(url, type) => handleDeleteFile(lessons._id, url, type)}
                        canDelete={true}
                      />
                    </div>

                  </div>
                  <div className="flex justify-end mt-10">

                    <input
                      type="submit"
                      value={updateLessonMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                      disabled={updateLessonMutation.isPending}
                      onClick={() =>
                        handleUpdateForm(lessons._id, {
                          ...lessons, // datos actuales de la lección
                          ...(pendingUpdates[lessons._id] || {}), // los archivos subidos o cambios pendientes
                        })
                      }
                      className={`w-full sm:w-auto px-5 py-2 rounded-md text-white font-medium transition ${updateLessonMutation.isPending
                        ? "bg-sky-400 cursor-not-allowed"
                        : "bg-sky-700 hover:bg-sky-800"
                        }`}
                    />


                  </div>
                </li>

              ))}
            </ul>
          ) : (
            <p className="text-center py-20">
              No hay lecciones creados{" "}
              <Link to={"/projects-create"} className="text-sky-700 font-bold hover:underline">
                Crear Lección
              </Link>
            </p>
          )}

          <ModalLessonAdd />
        </div>
      </>
    );
};

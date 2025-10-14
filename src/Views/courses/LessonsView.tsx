import { deleteLesson, getLessons } from "@/api/LessonsAPI";
import ModalLessonAdd from "@/components/lessons/ModalLessonAdd";
import UploadFile from "@/components/UploadCloudinary";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";

export const LessonsView = () => {


  const navigate = useNavigate();

  const params = useParams();
  const courseId = params.courseId!;
  const sectionId = params.sectionId!;

  const { data, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => getLessons({ courseId, sectionId }),
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


  if (isLoading) return "Cargando...";

  if (data)
    return (
      <>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-black text-slate-800">Mis lecciones</h1>
          <p className="text-lg font-light text-gray-500 mt-2">
            Maneja y administra las lecciones de la sección
          </p>

          <nav className="my-6 flex flex-col md:flex-row gap-3">
            <button
              type="button"
              className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
              onClick={() => navigate(location.pathname + `?addLesson=true`)}
            >
              Agregar nueva lección
            </button>

            <Link
              className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
              to={`/courses/${courseId}/sections`}
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
                    {/* subir y mostrar archivos multimedia */}
                    <UploadFile
                      label="Video"
                      accept="video/*"
                      multiple
                      onUploadComplete={(urls) =>
                        setPendingUpdates((prev) => ({
                          ...prev,
                          [lessons._id]: {
                            ...prev[lessons._id],
                            videoUrl: [...(prev[lessons._id]?.videoUrl || []), ...urls],
                          },
                        }))
                      }
                    />
                    {Array.isArray(lessons.videoUrl) && lessons.videoUrl.length > 0 ? (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {lessons.videoUrl.map((url) => (
                          <video
                            key={url}
                            src={url}
                            controls
                            className="w-90 h-70 rounded-xl border border-gray-300 object-cover"
                          />

                        ))}
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-slate-800">No hay videos disponibles en esta lección. </p>
                    )}

                    <div className="separation_line_lessons" />
                    {/* Subir y mostrar imagenes */}
                    <UploadFile
                      label="Imagen"
                      accept="image/*"
                      multiple
                      onUploadComplete={(urls) =>
                        setPendingUpdates((prev) => ({
                          ...prev,
                          [lessons._id]: {
                            ...prev[lessons._id],
                            videoUrl: [...(prev[lessons._id]?.videoUrl || []), ...urls],
                          },
                        }))
                      }
                    />

                    {Array.isArray(lessons.imageUrl) && lessons.imageUrl.length > 0 ? (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {lessons.imageUrl.map((url) => (

                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              key={url}
                              src={url}
                              alt="Imagen subida"
                              className="w-40 h-40 object-cover rounded-lg border hover:scale-105 transition-transform"
                            />
                          </a>
                        ))}

                      </div>
                    ) : (
                      <p className="text-xl font-bold text-slate-800">No hay imágenes disponibles en esta lección. </p>
                    )}

                    <div className="separation_line_lessons" />
                    {/* Subir y mostrar archivos */}
                    <UploadFile
                      label="Archivos"
                      accept=".pdf,.doc,.docx,.xlsx,.pptx"
                      multiple
                      onUploadComplete={(urls) =>
                        setPendingUpdates((prev) => ({
                          ...prev,
                          [lessons._id]: {
                            ...prev[lessons._id],
                            videoUrl: [...(prev[lessons._id]?.videoUrl || []), ...urls],
                          },
                        }))
                      }
                    />

                    {Array.isArray(lessons.fileUrl) && lessons.fileUrl.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {lessons.fileUrl.map((fileUrl: string, index: number) => {
                          const fileName = decodeURIComponent(fileUrl.split("/").pop() || "");
                          const isPDF = fileUrl.toLowerCase().endsWith(".pdf");
                          const isWord = fileUrl.toLowerCase().match(/\.(doc|docx)$/i);

                          // si es pdf o word, cambia la url para descarga
                          const downloadUrl =
                            isPDF || isWord
                              ? fileUrl.replace("/upload/", "/upload/fl_attachment/")
                              : fileUrl;

                          return (
                            <a
                              key={index}
                              href={downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center w-24 h-24 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                              {isPDF ? (
                                <div className="relative w-12 h-10">
                                  <DocumentTextIcon className="w-12 h-12 text-red-500" />
                                  <span className="absolute ml-2 top-2 left-1 text-white font-medium text-xs">
                                    PDF
                                  </span>
                                </div>
                              ) : isWord ? (
                                <div className="relative w-12 h-10">
                                  <DocumentTextIcon className="w-12 h-12 text-blue-600" />
                                  <span className="absolute ml-2 top-2 left-2.5 text-white font-medium text-xs">
                                    W
                                  </span>
                                </div>
                              ) : (
                                <div className="relative w-12 h-10">
                                  <DocumentTextIcon className="w-12 h-12 text-gray-500" />
                                </div>
                              )}

                              <span className="text-xs text-blue-600 mt-1">Ver</span>
                              <span className="text-[10px] text-gray-500 truncate w-20 text-center">
                                {fileName}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-slate-800">No hay archivos disponibles en esta lección. </p>
                    )}

                  </div>
                  <div className="flex justify-end mt-10">

                    <input
                      type="submit"
                      value='Guardar Cambios'
                      className="w-full sm:w-auto px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
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

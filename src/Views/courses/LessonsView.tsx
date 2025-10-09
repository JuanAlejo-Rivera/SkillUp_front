import { deleteLesson, getLessons } from "@/api/LessonsAPI";
import ModalLessonAdd from "@/components/lessons/ModalLessonAdd";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
              className="bg-slate-700 hover:bg-slate-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
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
                      <p className="text-sm text-gray-500 mt-1">{lessons.description}</p>
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

                  {/* contenido de video */}
                  <div className="flex flex-col gap-4">
                    {/* Video principal */}
                    {lessons.videoUrl && (
                      <div className="w-full">
                        <video
                          src={lessons.videoUrl}
                          controls
                          className="w-120 h-100 rounded-xl object-cover border border-gray-300"
                        />
                      </div>
                    )}
                    {/* contenido de imagenes y archivos */}
                    <div className="flex flex-wrap gap-4">
                      {lessons.imageUrl && (
                        <a
                          href={lessons.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={lessons.imageUrl}
                            alt="Imagen subida"
                            className="w-32 h-32 object-cover rounded-lg border hover:scale-105 transition-transform"
                          />
                        </a>
                      )}

                      {lessons.fileUrl && (
                        <a
                          href={lessons.fileUrl.replace(
                            "/upload/",
                            "/upload/fl_attachment/"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center w-24 h-24 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          {
                            lessons.fileUrl.match(/pdf/i) ? (
                              <div className="relative w-12 h-10">
                                <DocumentTextIcon className="w-12 h-12 text-red-500" />
                                <span className="absolute ml-2 top-1 left-1 text-white font-bold text-sm">pdf</span>
                              </div>

                            ) : <div className="relative w-12 h-10">
                              <DocumentTextIcon className="w-12 h-12 text-blue-600" />
                              <span className="absolute ml-3 top-1 left-1 text-white font-bold text-sm">W</span>
                            </div>
                          }


                          <span className="text-xs text-blue-600 mt-1">Ver</span>
                          <span className="text-[10px] text-gray-500 truncate w-20 text-center">
                            {lessons.fileUrl.split("/").pop()?.replace(/%[0-9A-Fa-f]{2}/g, " ")}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-20">
              No hay proyectos creados{" "}
              <Link to={"/projects-create"} className="text-sky-700 font-bold hover:underline">
                Crear Proyecto
              </Link>
            </p>
          )}

          <ModalLessonAdd />
        </div>
      </>
    );
};

import { PlusIcon } from "@heroicons/react/20/solid";
import ErrorMessage from "../ErrorMessage";
import type { LessonFormData } from "@/types/index";
import type { FieldErrors, UseFormRegister } from "react-hook-form";


type LessonFormProps = {
    register: UseFormRegister<LessonFormData>
    errors: FieldErrors<LessonFormData>
}

export default function LessonForm({ errors, register }: LessonFormProps) {
    return (
        <>

            <div>
                <label htmlFor="title" className="text-sm uppercase font-bold">
                    Título
                </label>
                <input
                    id="title"
                    type="text"
                    className="w-full rounded-md border border-sky-700 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Escribe el título de la lección"
                    {...register("title", {
                        required: "El título de la lección es obligatorio",
                    })}
                />

                {errors.title && (
                    <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
            </div>

            <div>
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <textarea
                    id="description"
                    rows={3}
                    className="w-full p-3  border border-sky-700 rounded-xl"
                    placeholder="Escribe una breve descripción"
                    {...register("description", {
                        required: "La descripción de la lección es obligatoria"
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>

            {/* file upload */}
            <div>
                <p className="text-lg font-semibold text-slate-700 mb-3">
                    Archivos adjuntos
                </p>
                <div className="grid grid-cols-3 gap-6">

                    {/* Video */}
                    <div
                        // onClick={() => handleBoxClick(videoRef)}
                        className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 transition"
                    >
                        <PlusIcon className="w-10 h-10 text-slate-400" />
                        <p className="text-sm text-slate-500 mt-2">Subir Video</p>
                        <input
                            type="text"
                            {...register("videoUrl")}
                        />
                    </div>

                    {/* Document */}
                    <div
                        // onClick={() => handleBoxClick(docRef)}
                        className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 transition"
                    >
                        <PlusIcon className="w-10 h-10 text-slate-400" />
                        <p className="text-sm text-slate-500 mt-2">Subir Documento</p>
                        <input
                            type="text"
                            {...register("fileUrl")}
                        />
                    </div>

                    {/* Imagen */}
                    <div
                        // onClick={() => handleBoxClick(imageRef)}
                        className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 transition"
                    >
                        <PlusIcon className="w-10 h-10 text-slate-400" />
                        <p className="text-sm text-slate-500 mt-2">Subir Imagen</p>
                        <input
                            type="text"
                            {...register("imageUrl")}
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

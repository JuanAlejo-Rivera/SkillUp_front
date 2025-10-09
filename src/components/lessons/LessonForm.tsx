import ErrorMessage from "../ErrorMessage";
import type { LessonFormData } from "@/types/index";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import UploadFile from "../UploadCloudinary";

type LessonFormProps = {
  register: UseFormRegister<LessonFormData>;
  errors: FieldErrors<LessonFormData>;
  setValue: UseFormSetValue<LessonFormData>;
};

export default function LessonForm({ errors, register, setValue }: LessonFormProps) {
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
          {...register("title", { required: "El título de la lección es obligatorio" })}
        />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </div>

      <div>
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripción
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full p-3 border border-sky-700 rounded-xl"
          placeholder="Escribe una breve descripción"
          {...register("description", { required: "La descripción de la lección es obligatoria" })}
        />
        {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
      </div>

      <div>
        <p className="text-lg font-semibold text-slate-700 mb-3">Archivos adjuntos</p>
        <div className="grid grid-cols-3 gap-6">
          <UploadFile label="Subir Video" accept="video/*" onUploadComplete={(url) => setValue("videoUrl", url)} />
          <UploadFile label="Subir Documento" accept=".pdf,.doc,.docx,.xlsx,.pptx" onUploadComplete={(url) => setValue("fileUrl", url)} />
          <UploadFile label="Subir Imagen" accept="image/*" onUploadComplete={(url) => setValue("imageUrl", url)} />
        </div>
      </div>
    </>
  );
}

import ErrorMessage from "../ErrorMessage";
import type { LessonFormData } from "@/types/index";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

type LessonFormProps = {
  register: UseFormRegister<LessonFormData>;
  errors: FieldErrors<LessonFormData>;
  setValue: UseFormSetValue<LessonFormData>;
};

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

    </>
  );
}

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { SectionFormData } from "types";


type CourseFormProps = {
    register: UseFormRegister<SectionFormData>
    errors: FieldErrors<SectionFormData>
}

export default function SectionForm({ errors, register }: CourseFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="title" className="text-sm uppercase font-bold">
                    Nombre de la Sección
                </label>
                <input
                    id="title"
                    className="w-full p-3  border border-sky-700 rounded-xl"
                    type="text"
                    placeholder="Nombre del Curso"
                    {...register("title", {
                        required: "El Titulo de la sección es obligatorio",
                    })}
                />

                {errors.title && (
                    <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <textarea
                    id="description"
                    className="w-full p-3  border border-sky-700 rounded-xl"
                    placeholder="Descripción del Curso"
                    {...register("description", {
                        required: "Una descripción de la sección es obligatoria"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}
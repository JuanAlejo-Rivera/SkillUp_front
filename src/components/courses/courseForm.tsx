import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { CourseFormData } from "types";


type CourseFormProps = {
    register: UseFormRegister<CourseFormData>
    errors: FieldErrors<CourseFormData>
}

export default function CourseForm({ errors, register }: CourseFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="courseName" className="text-sm uppercase font-bold">
                    Nombre del Curso
                </label>
                <input
                    id="courseName"
                    className="w-full p-3  border border-sky-700 rounded-xl"
                    type="text"
                    placeholder="Nombre del Curso"
                    {...register("courseName", {
                        required: "El Titulo del Curso es obligatorio",
                    })}
                />

                {errors.courseName && (
                    <ErrorMessage>{errors.courseName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="department" className="text-sm uppercase font-bold">
                    Departamento
                </label>
                <select
                    id="department"
                    className="w-full p-3 border border-sky-700 rounded-xl"
                    {...register("department", { required: "El departamento es obligatorio" })}
                >
                    <option value="">-- Selecciona un departamento --</option>
                    <option value="informatica">Informática</option>
                    <option value="matematicas">Matemáticas</option>
                    <option value="fisica">Física</option>
                </select>

                {errors.department && (
                    <ErrorMessage>{errors.department.message}</ErrorMessage>
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
                        required: "Una descripción del curso es obligatoria"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}
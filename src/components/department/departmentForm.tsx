import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { DepartmentFormData } from "types";


type CourseFormProps = {
    register: UseFormRegister<DepartmentFormData>
    errors: FieldErrors<DepartmentFormData>
}

export default function DeparmentForm({ errors, register }: CourseFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="departmentName" className="text-sm uppercase font-bold">
                    Nombre del departamento
                </label>
                <input
                    id="departmentName"
                    className="w-full p-3  border border-sky-700 rounded-xl"
                    type="text"
                    placeholder="Nombre del departamento"
                    {...register("departmentName", {
                        required: "El departamento es obligatorio",
                    })}
                />

                {errors.departmentName && (
                    <ErrorMessage>{errors.departmentName.message}</ErrorMessage>
                )}
            </div>

        </>
    )
}
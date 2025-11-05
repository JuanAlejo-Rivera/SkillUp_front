import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { CourseFormData } from "types";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/api/DeparmentsAPI";

type CourseFormProps = {
    register: UseFormRegister<CourseFormData>
    errors: FieldErrors<CourseFormData>
}


export default function CourseForm({ errors, register }: CourseFormProps) {

    const { data, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: getDepartments
    })

    if (isLoading) return 'Cargando...'
    if (data) return (
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

                    {data?.map((department) => (
                        <option key={department._id} value={department._id}>
                            {department.departmentName}
                        </option>
                    ))}

                </select>

                {errors.department && (
                    <ErrorMessage>{errors.department.message}</ErrorMessage>
                )}
            </div >


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
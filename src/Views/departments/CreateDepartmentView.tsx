import { createDepartment } from "@/api/DeparmentsAPI"
import DeparmentForm from "@/components/department/departmentForm"
import type { DepartmentFormData } from "@/types/index"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const CreateDepartmentView = () => {

    const navigate = useNavigate()

    const initialValues: DepartmentFormData = {
        departmentName: "",
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createDepartment,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate(-1)
        }
    })


    const handleForm = (data: DepartmentFormData) => {
        const formattedData = {
            ...data,
            departmentName: data.departmentName.toUpperCase()
        };
        mutate(formattedData);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                    <h1 className="text-4xl font-black text-white mb-3">Añadir Nuevo Departamento</h1>
                    <p className="text-lg font-light text-gray-300 mb-8">Completa los detalles a continuación para crear un nuevo departamento.</p>

                    <form
                        className="bg-gradient-to-br from-white to-gray-50 shadow-2xl p-10 rounded-3xl border-2 border-gray-200"
                        onSubmit={handleSubmit(handleForm)}
                        noValidate
                    >

                        <DeparmentForm
                            register={register}
                            errors={errors}
                        />

                        <div className="flex gap-4 pt-6 border-t-2 border-gray-200 mt-8">
                            <Link
                                to={"/courses-create"}
                                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Crear Departamento
                            </button>
                        </div>


                    </form>

                </div>


            </div>
        </>
    )
}

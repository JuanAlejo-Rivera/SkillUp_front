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
            <div className="max-w-lg mx-auto ">


                <h1 className="text-2xl font-black">Añadir Nuevo Departamento</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Completa los detalles a continuación para crear un nuevo departamento.</p>

                <nav className="my-5 flex flex-col md:flex-row gap-3">

                </nav>

                <form
                    className="mt-10 bg-slate-200 shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <DeparmentForm
                        register={register}
                        errors={errors}
                    />

                    <div className="flex justify-between">
                        <Link
                            to={"/courses-create"}
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-medium transition"
                        >
                            Cancelar
                        </Link>

                        <input
                            type="submit"
                            value="Crear Departamento"
                            className="w-full sm:w-auto px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
                        />
                    </div>


                </form>


            </div>
        </>
    )
}

import { deleteDeparment, getDepartments } from "@/api/DeparmentsAPI"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const DepartmentList = () => {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: getDepartments
    })

    const { mutate } = useMutation({
        mutationFn: deleteDeparment,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['departments'] })
            queryClient.invalidateQueries({ queryKey: ['courses'] })
        }

    })


    if (isLoading) return "Cargando …"
    if (data) return (
        <div>
            <h2 className="text-xl font-bold mb-4">Lista de Departamentos</h2>
            <ul className="space-y-2">

                {data?.map((department: any) => (
                    <li key={department._id} className="flex justify-between items-center border p-3 rounded-md">
                        <span>{department.departmentName}</span>
                        <button
                            type="button"
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={() => mutate(department._id)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

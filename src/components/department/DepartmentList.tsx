import { deleteDeparment, getDepartments } from "@/api/DeparmentsAPI"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const DepartmentList = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    // const [deletingId, setDeletingId] = useState<string | null>(null)

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
            navigate(location.pathname)
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
                        // disabled={deletingId === department._id}
                        >
                            {/* {deletingId === department._id ? 'Eliminando...' : 'Eliminar'} */}
                            borrar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

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


    if (isLoading) return <div className="text-center py-8 text-gray-600 text-lg">Cargando departamentos...</div>
    if (data) return (
        <div className="my-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Lista de Departamentos</h2>
            {data.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {data?.map((department: any) => (
                        <li key={department._id} className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-200 p-4 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {department.departmentName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-slate-900 font-semibold text-lg">{department.departmentName}</span>
                            </div>
                            <button
                                type="button"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                onClick={() => mutate(department._id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 text-lg font-semibold">No hay departamentos creados</p>
                </div>
            )}
        </div>
    )
}

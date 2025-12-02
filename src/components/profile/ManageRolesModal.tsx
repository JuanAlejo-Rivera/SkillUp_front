import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getAllUsers, updateUserRole } from '@/api/ProfileAPI';

type User = {
    _id: string;
    email: string;
    name: string;
    role: 'admin' | 'teacher' | 'user';
};

export default function ManageRolesModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const manageRoles = queryParams.get('manageRoles');
    const show = manageRoles ? true : false;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});

    const queryClient = useQueryClient();

    // Fetch all users
    const { data: users, isLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: getAllUsers,
        enabled: show,
    });

    const { mutate } = useMutation({
        mutationFn: ({ email, newRole }: { email: string; newRole: string }) => updateUserRole(email, newRole),
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
        },
    });

    const handleUpdateRole = (email: string) => {
        const newRole = selectedRoles[email];
        if (!newRole) {
            toast.error('Por favor selecciona un rol');
            return;
        }
        mutate({ email, newRole });
    };

    const filteredUsers = users?.filter((user: User) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => {
                    navigate(location.pathname, { replace: true });
                    setSelectedRoles({});
                }}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#111B2E] p-8 text-left align-middle shadow-2xl transition-all border border-blue-700/30">
                                <DialogTitle as="h3" className="text-3xl font-black text-white mb-6">
                                    Gestionar Roles de Usuario
                                </DialogTitle>

                                {isLoading ? (
                                    <p className="text-gray-300">Cargando usuarios...</p>
                                ) : (
                                    <>
                                        {/* Search Input */}
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                placeholder="Buscar por email o nombre..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#1A2537] text-white border border-blue-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>

                                        {/* Users List */}
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {filteredUsers && filteredUsers.length > 0 ? (
                                                filteredUsers.map((user: User) => (
                                                    <div
                                                        key={user._id}
                                                        className="bg-[#1A2537] p-5 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-all"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                            <div className="flex-1">
                                                                <p className="text-white font-semibold text-lg">{user.name}</p>
                                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                                                <p className="text-blue-300 text-xs mt-1">
                                                                    Rol actual: <span className="font-bold uppercase">{user.role}</span>
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col md:flex-row gap-3 md:items-center">
                                                                <select
                                                                    value={selectedRoles[user.email] || user.role}
                                                                    onChange={(e) => setSelectedRoles({ ...selectedRoles, [user.email]: e.target.value })}
                                                                    className="px-4 py-2 rounded-lg bg-[#3A5A80] text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                                                >
                                                                    <option value="user">Usuario</option>
                                                                    <option value="teacher">Profesor</option>
                                                                    <option value="admin">Administrador</option>
                                                                </select>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUpdateRole(user.email)}
                                                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                                >
                                                                    Actualizar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-center py-8">No se encontraron usuarios.</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
                                        onClick={() => {
                                            navigate(location.pathname, { replace: true });
                                            setSelectedRoles({});
                                        }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function TooltipNote() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 max-w-xs">
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-xl p-4">
                {/* Botón de cerrar */}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-2 right-2 text-white/80 hover:text-white transition"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Icono y texto */}
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Acceso de prueba</p>
                        <p className="text-sm text-gray-100">
                            Usa estos correos para entrar sin registrarte:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                            <li>
                                <p className="font-bold">Administrador:</p>
                                <p>Acceso completo para administrar el sistema.</p>
                                📧 <code>rootmail@mail.com</code> / <code>password</code>
                            </li>
                            <li>
                                <p className="font-bold">Profesor:</p>
                                <p>Puede editar únicamente sus propios cursos.</p>
                                📧 <code>teacher@correo.com</code> / <code>password</code>
                            </li>
                            <li>
                                <p className="font-bold">Estudiante:</p>
                                <p>Acceso al contenido sin permisos de edición.</p>
                                📧 <code>user@email.com</code> / <code>password</code>
                            </li>
                        </ul>
                        <p className="mt-3 text-xs text-gray-200 leading-snug">
                            ⚠️ Esto se debe a que los correos de confirmación llegan a
                            <span className="font-semibold"> Mailtrap</span>, un programa gratuito
                            para pruebas de envío y confirmación de correos.
                        </p>
                        <p className="mt-3 text-xs text-gray-200 leading-snug">
                            ⚠️ El servidor puede tardar hasta{" "}
                            <span className="font-bold">1 minuto</span> en responder, ya que está
                            alojado de forma gratuita en <span className="font-semibold">Render</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

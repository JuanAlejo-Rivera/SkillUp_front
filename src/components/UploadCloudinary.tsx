import React, { useState, useEffect } from "react";
import { PlusIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/20/solid";

type UploadFileProps = {
  label: string;
  accept?: string;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
  resetTrigger?: boolean;
};

type UploadProgress = {
  fileName: string;
  progress: number;
};

export default function UploadFile({
  label,
  accept,
  multiple = false,
  onUploadComplete,
  resetTrigger,
}: UploadFileProps) {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    setFileUrls([]);
    setUploadProgress([]);
  }, [resetTrigger]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setTotalFiles(files.length);
    const progressArray: UploadProgress[] = Array.from(files).map((file) => ({
      fileName: file.name,
      progress: 0,
    }));
    setUploadProgress(progressArray);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const fileName = file.name.split(".")[0];

        // Simular progreso inicial
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index].progress = 30;
          return newProgress;
        });

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload?public_id=${encodeURIComponent(fileName)}`,
          { method: "POST", body: formData }
        );

        // Actualizar progreso a 70% después de enviar
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index].progress = 70;
          return newProgress;
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error("Error al subir archivo");

        // Completar progreso
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index].progress = 100;
          return newProgress;
        });

        return data.secure_url;
      });

      const urls = await Promise.all(uploadPromises);

      setFileUrls(urls);
      onUploadComplete(urls);
    } catch (err) {
      console.error("Error al subir archivos:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress([]), 1000);
    }
  };

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden
        ${loading 
          ? "border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-2xl scale-[1.02]" 
          : "border-slate-300 hover:border-blue-400 hover:shadow-lg hover:scale-[1.01] bg-white"
        }
        ${fileUrls.length > 0 ? "p-4" : "p-6 min-w-[140px]"}`}
      >
        {/* Animación de fondo ondulante mientras carga */}
        {loading && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/20 to-purple-400/10 animate-gradient-x" />
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="animate-wave-1 absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
                <div className="animate-wave-2 absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"></div>
              </div>
            </div>
          </>
        )}

        <label className="flex flex-col items-center justify-center cursor-pointer relative z-10 w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              {/* Spinner mejorado con múltiples anillos */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CloudArrowUpIcon className="w-8 h-8 text-blue-600 animate-bounce-slow" />
                </div>
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75" />
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-indigo-600 rounded-full animate-spin-fast" />
                <div className="absolute inset-2 border-3 border-transparent border-t-purple-500 border-l-pink-500 rounded-full animate-spin-reverse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-700 animate-pulse-slow">Subiendo {totalFiles} archivo(s)...</p>
                <div className="flex items-center gap-1 justify-center mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce-dot-1"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce-dot-2"></div>
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce-dot-3"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 group">
              <div className="relative">
                <PlusIcon className="w-8 h-8 text-slate-400 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-125 group-hover:rotate-90" />
                <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-300 blur-md"></div>
              </div>
              <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">{label}</p>
            </div>
          )}
          <input 
            type="file" 
            accept={accept} 
            multiple={multiple} 
            className="hidden" 
            onChange={handleUpload}
            disabled={loading}
          />
        </label>

        {/* Barras de progreso individuales mejoradas */}
        {loading && uploadProgress.length > 0 && (
          <div className="w-full mt-3 space-y-1.5 relative z-10 max-h-32 overflow-y-auto">
            {uploadProgress.map((item, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-md rounded-lg p-2 shadow-md border border-blue-100 animate-slideIn" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                    {item.fileName.length > 15 ? item.fileName.substring(0, 15) + '...' : item.fileName}
                  </span>
                  <span className="text-xs font-bold text-blue-600 animate-pulse-slow">{item.progress}%</span>
                </div>
                <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista previa de archivos mejorada */}
        {!loading && fileUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center relative z-10 w-full">
            {fileUrls.map((url, i) => (
              <div 
                key={`${url}-${i}`} 
                className="relative w-16 h-16 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-110 hover:z-20 shadow-lg hover:shadow-2xl animate-popIn group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Efecto de brillo al cargar */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 animate-pulse-once" />
                
                {/* Checkmark animado */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg animate-bounce-in">
                  <svg className="w-3 h-3 text-white animate-check" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Borde animado al hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-lg transition-all duration-300" />
                
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                ) : url.match(/\.(mp4|mov|avi|webm)$/i) ? (
                  <video src={url} className="w-full h-full object-cover" />
                ) : url.match(/\.pdf$/i) ? (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100">
                    <DocumentTextIcon className="w-7 h-7 text-red-600" />
                    <span className="text-[10px] font-bold text-red-700">PDF</span>
                  </div>
                ) : url.match(/\.docx?$/i) ? (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
                    <DocumentTextIcon className="w-7 h-7 text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-700">DOC</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 p-1">
                    <DocumentTextIcon className="w-7 h-7 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

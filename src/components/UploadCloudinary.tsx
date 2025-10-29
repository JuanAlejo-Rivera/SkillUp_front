import React, { useState, useEffect } from "react";
import { CloudArrowUpIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon, VideoCameraIcon, PhotoIcon } from "@heroicons/react/24/solid";

type UploadFileProps = {
  label: string;
  accept?: string;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
  resetTrigger?: boolean;
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
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setFileUrls([]);
  }, [resetTrigger]);

  const handleRemoveFile = (urlToRemove: string) => {
    const updatedUrls = fileUrls.filter((url: string) => url !== urlToRemove);
    setFileUrls(updatedUrls);
    onUploadComplete(updatedUrls);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setUploadProgress(0);
    
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const fileName = file.name.split(".")[0];

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload?public_id=${encodeURIComponent(fileName)}`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error("Error al subir archivo");
        
        // Actualizar progreso
        setUploadProgress(((index + 1) / files.length) * 100);
        
        return data.secure_url;
      });

      const urls = await Promise.all(uploadPromises);

      setFileUrls(urls);
      onUploadComplete(urls);
    } catch (err) {
      console.error("Error al subir archivos:", err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (url: string) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return PhotoIcon;
    if (url.match(/\.(mp4|mov|avi|webm)$/i)) return VideoCameraIcon;
    return DocumentTextIcon;
  };

  return (
    <div className="w-full">
      <div
        className={`group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          loading 
            ? "border-blue-400 bg-blue-50/50" 
            : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50"
        } ${fileUrls.length > 0 ? "p-4" : "p-8"}`}
      >
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <div className={`relative ${loading ? "animate-bounce" : ""}`}>
            {loading ? (
              <div className="relative">
                <CloudArrowUpIcon className="w-12 h-12 text-blue-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : fileUrls.length > 0 ? (
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            ) : (
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
            )}
          </div>
          
          <p className="mt-3 text-sm font-medium text-gray-700">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Subiendo {Math.round(uploadProgress)}%...
              </span>
            ) : fileUrls.length > 0 ? (
              `✓ ${fileUrls.length} archivo(s) cargado(s)`
            ) : (
              <>
                <span className="text-blue-600 font-semibold">Haz clic para subir</span>
                <span className="text-gray-500"> o arrastra archivos</span>
              </>
            )}
          </p>
          
          <p className="mt-1 text-xs text-gray-500">
            {label} {multiple && "(múltiples archivos)"}
          </p>
          
          <input 
            type="file" 
            accept={accept} 
            multiple={multiple} 
            className="hidden" 
            onChange={handleUpload}
            disabled={loading}
          />
        </label>

        {/* Barra de progreso */}
        {loading && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Vista previa de archivos */}
        {fileUrls.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {fileUrls.map((url: string, i: number) => {
              const Icon = getFileIcon(url);
              return (
                <div 
                  key={`${url}-${i}`} 
                  className="group/item relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Botón de eliminar mejorado */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(url)}
                    className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-1.5 opacity-0 group-hover/item:opacity-100 transition-all duration-200 z-20 hover:scale-110 hover:shadow-lg shadow-red-500/50"
                    title="Eliminar archivo"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>

                  {/* Overlay de hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-10"></div>

                  {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <div className="aspect-square">
                      <img src={url} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ) : url.match(/\.(mp4|mov|avi|webm)$/i) ? (
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <VideoCameraIcon className="w-16 h-16 text-purple-500" />
                    </div>
                  ) : url.match(/\.pdf$/i) ? (
                    <div className="aspect-square bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center">
                      <DocumentTextIcon className="w-16 h-16 text-red-500" />
                      <span className="text-xs font-bold text-red-600 mt-2">PDF</span>
                    </div>
                  ) : url.match(/\.docx?$/i) ? (
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
                      <DocumentTextIcon className="w-16 h-16 text-blue-600" />
                      <span className="text-xs font-bold text-blue-700 mt-2">WORD</span>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2">
                      <Icon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

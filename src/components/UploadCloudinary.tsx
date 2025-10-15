import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/20/solid";

type UploadFileProps = {
  label: string;
  accept?: string;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
  resetTrigger?: boolean; // 👈 usado para limpiar desde el padre
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

  // 👇 Si el padre cambia resetTrigger, limpiamos el estado local
  useEffect(() => {
    setFileUrls([]);
  }, [resetTrigger]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
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
        return data.secure_url;
      });

      const urls = await Promise.all(uploadPromises);

      // ✅ Actualiza el estado local y notifica al padre
      setFileUrls(urls);
      onUploadComplete(urls);
    } catch (err) {
      console.error("Error al subir archivos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-sky-500 transition relative 
      ${fileUrls.length > 0 ? "w-auto h-auto" : "w-20 h-15"}`}
    >
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <PlusIcon className="w-5 h-5 text-slate-400 mt-3" />
        <p className="text-sm text-slate-500">{loading ? "Subiendo..." : label}</p>
        <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleUpload} />
      </label>

      {/* Vista previa de archivos */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {fileUrls.map((url, i) => (
          <div key={`${url}-${i}`} className="w-20 h-20 border rounded-lg overflow-hidden relative">
            {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={url} alt="preview" className="w-full h-full object-cover" />
            ) : url.match(/\.(mp4|mov|avi|webm)$/i) ? (
              <video src={url} controls className="w-full h-full object-cover" />
            ) : url.match(/\.pdf$/i) ? (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <DocumentTextIcon className="w-8 h-8 text-red-500" />
                <span className="text-xs mt-1 text-gray-500">PDF</span>
              </div>
            ) : url.match(/\.docx?$/i) ? (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <DocumentTextIcon className="w-8 h-8 text-blue-500" />
                <span className="text-xs mt-1 text-gray-500">WORD</span>
              </div>
            ) : (
              <span className="text-xs text-gray-600 p-2 break-all">{url}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

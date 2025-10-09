import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/20/solid";

type UploadFileProps = {
  label: string;
  accept?: string;
  onUploadComplete: (url: string) => void;
};

export default function UploadFile({ label, accept, onUploadComplete }: UploadFileProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const fileName = file.name.split(".")[0];

      const uploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload?public_id=${encodeURIComponent(fileName)}`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });





      const data = await res.json();
      if (!data.secure_url) throw new Error("Error al subir a Cloudinary");

      setFileUrl(data.secure_url);
      onUploadComplete(data.secure_url);
    } catch (err) {
      console.error("Error al subir archivo:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!fileUrl) return null;

    if (fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      return <img src={fileUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg" />;

    if (fileUrl.match(/\.(mp4|mov|avi|web)$/i))
      return <video src={fileUrl} controls className="w-24 h-24 rounded-lg" />;

    if (fileUrl.match(/\.pdf$/i))
      return (
        <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
            <DocumentTextIcon className="w-10 h-10 text-red-500" />
            <span className="text-xs text-gray-500 mt-1">PDF</span>
          </a>
        </div>
      );

    return (
      <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
        Archivo subido
      </a>
    );
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-sky-500 transition relative">
      {!fileUrl ? (
        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
          <PlusIcon className="w-10 h-10 text-slate-400" />
          <p className="text-sm text-slate-500 mt-2">{loading ? "Subiendo..." : label}</p>
          <input type="file" accept={accept} className="hidden" onChange={handleUpload} />
        </label>
      ) : (
        <div className="flex flex-col items-center">{renderPreview()}</div>
      )}
    </div>
  );
}

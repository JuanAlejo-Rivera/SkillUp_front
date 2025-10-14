import type { LessonFormData } from "@/types/index";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import UploadFile from "../UploadCloudinary";
import { useState, useEffect } from "react";

type LessonFormProps = {
  register: UseFormRegister<LessonFormData>;
  errors: FieldErrors<LessonFormData>;
  setValue: UseFormSetValue<LessonFormData>;
};

export default function AddFiles({ setValue }: LessonFormProps) {
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    imageUrls: [] as string[],
    videoUrls: [] as string[],
    documentUrls: [] as string[],
  });

  // Cada vez que lessonData cambia, actualizamos el form de RHF
  useEffect(() => {
    setValue("imageUrl", lessonData.imageUrls);
    setValue("videoUrl", lessonData.videoUrls);
    setValue("fileUrl", lessonData.documentUrls);
  }, [lessonData, setValue]);

  return (
    <>

      <div>
        <p className="text-lg font-semibold text-slate-700 mb-3">Archivos adjuntos</p>
        <div className="grid grid-cols-3 gap-6">

          <UploadFile
            label="Subir Video"
            accept="video/*"
            multiple
            onUploadComplete={(urls) =>
              setLessonData((prev) => ({ ...prev, videoUrls: [...prev.videoUrls, ...urls] }))
            }
          />

          <UploadFile
            label="Subir Documento"
            accept=".pdf,.doc,.docx,.xlsx,.pptx"
            multiple
            onUploadComplete={(urls) =>
              setLessonData((prev) => ({ ...prev, documentUrls: [...prev.documentUrls, ...urls] }))
            }
          />

          <UploadFile
            label="Subir Imagen"
            accept="image/*"
            multiple
            onUploadComplete={(urls) =>
              setLessonData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }))
            }
          />

        </div>
      </div>
    </>
  );
}

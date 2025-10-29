import React, { useState } from "react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon, PlayCircleIcon, PhotoIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { deleteFileFromLesson } from "@/api/FilesAPI";
import { toast } from "react-toastify";

type FileDisplayProps = {
  lessonId: string;
  videoUrls?: string[];
  imageUrls?: string[];
  fileUrls?: string[];
  onFileDeleted: (fileType: 'video' | 'image' | 'file', url: string) => void;
  canDelete?: boolean;
};

export default function FileDisplay({
  lessonId,
  videoUrls = [],
  imageUrls = [],
  fileUrls = [],
  onFileDeleted,
  canDelete = true
}: FileDisplayProps) {
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleDeleteFile = async (url: string, fileType: 'video' | 'image' | 'file') => {
    if (!canDelete) return;

    setDeletingUrl(url);
    try {
      await deleteFileFromLesson(lessonId, url, fileType);
      onFileDeleted(fileType, url);
      toast.success('🗑️ Archivo eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar archivo');
    } finally {
      setDeletingUrl(null);
    }
  };

  const renderFile = (url: string, fileType: 'video' | 'image' | 'file', index: number) => {
    const isDeleting = deletingUrl === url;
    
    return (
      <div 
        key={`${fileType}-${index}`} 
        className={`group relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
          isDeleting ? 'opacity-50 scale-95' : ''
        }`}
      >
        {canDelete && (
          <div className="absolute top-3 right-3 z-20 flex gap-2">
            <button
              type="button"
              onClick={() => handleDeleteFile(url, fileType)}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:shadow-lg shadow-red-500/50 disabled:cursor-not-allowed"
              title="Eliminar archivo"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <XMarkIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        {/* Overlay decorativo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

        {fileType === 'image' && (
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={url} 
              alt="lesson image" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg hover:bg-white transition-colors font-medium text-sm"
              >
                <PhotoIcon className="w-4 h-4" />
                Ver imagen completa
              </a>
            </div>
          </div>
        )}

        {fileType === 'video' && (
          <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-blue-900 overflow-hidden">
            <video src={url} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <PlayCircleIcon className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-white font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Reproducir video
              </p>
            </div>
            <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg hover:bg-white transition-colors font-medium text-sm"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Descargar video
              </a>
            </div>
          </div>
        )}

        {fileType === 'file' && (
          <div className="relative aspect-square bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {url.toLowerCase().endsWith('.pdf') ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                  <DocumentTextIcon className="relative w-20 h-20 text-red-500 drop-shadow-lg" />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                  <DocumentTextIcon className="relative w-20 h-20 text-blue-600 drop-shadow-lg" />
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {url.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCUMENTO'}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                  {url.split('/').pop()?.split('.')[0]?.substring(0, 15)}...
                </p>
              </div>
            </div>

            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Descargar
            </a>
          </div>
        )}
      </div>
    );
  };

  const totalFiles = videoUrls.length + imageUrls.length + fileUrls.length;

  return (
    <div className="space-y-8">
      {/* Header con estadísticas */}
      {totalFiles > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Archivos Multimedia</h3>
              <p className="text-sm text-gray-600">
                {totalFiles} archivo{totalFiles !== 1 ? 's' : ''} disponible{totalFiles !== 1 ? 's' : ''} en esta lección
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Videos */}
      {videoUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <PlayCircleIcon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Videos ({videoUrls.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoUrls.map((url, index) => renderFile(url, 'video', index))}
          </div>
        </div>
      )}

      {/* Imágenes */}
      {imageUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <PhotoIcon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Imágenes ({imageUrls.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {imageUrls.map((url, index) => renderFile(url, 'image', index))}
          </div>
        </div>
      )}

      {/* Documentos */}
      {fileUrls.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              Documentos ({fileUrls.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {fileUrls.map((url, index) => renderFile(url, 'file', index))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay archivos */}
      {totalFiles === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="inline-block p-6 bg-white rounded-2xl shadow-lg mb-4">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No hay archivos todavía</h3>
          <p className="text-gray-500">Sube videos, imágenes o documentos para comenzar</p>
        </div>
      )}
    </div>
  );
}
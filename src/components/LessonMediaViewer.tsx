import { useState } from "react";
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { 
  DocumentTextIcon, 
  VideoCameraIcon, 
  PhotoIcon,
  PlayCircleIcon,
  DocumentArrowDownIcon 
} from "@heroicons/react/24/solid";

type LessonMediaViewerProps = {
  videoUrls?: string[];
  imageUrls?: string[];
  fileUrls?: string[];
  onDeleteFile?: (url: string, type: 'video' | 'image' | 'file') => void;
  canDelete?: boolean;
};

export default function LessonMediaViewer({
  videoUrls = [],
  imageUrls = [],
  fileUrls = [],
  onDeleteFile,
  canDelete = true
}: LessonMediaViewerProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleDelete = async (url: string, type: 'video' | 'image' | 'file') => {
    if (!onDeleteFile) return;
    setDeletingUrl(url);
    await onDeleteFile(url, type);
    setDeletingUrl(null);
  };

  const MediaCard = ({ 
    url, 
    type, 
    index 
  }: { 
    url: string; 
    type: 'video' | 'image' | 'file'; 
    index: number;
  }) => {
    const isDeleting = deletingUrl === url;

    return (
      <div
        className={`group relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
          isDeleting ? 'opacity-50 scale-95' : ''
        }`}
      >
        {/* Botones de acción */}
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {canDelete && onDeleteFile && (
            <button
              onClick={() => handleDelete(url, type)}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 hover:scale-110 hover:shadow-lg shadow-red-500/50 transition-all disabled:cursor-not-allowed"
              title="Eliminar"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <XMarkIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Overlay decorativo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

        {/* Contenido según tipo */}
        {type === 'video' && (
          <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-blue-900">
            <video src={url} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <PlayCircleIcon className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform duration-300 mx-auto" />
                <p className="text-white font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Reproducir video
                </p>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2.5 rounded-xl hover:bg-white transition-colors font-medium text-sm shadow-lg"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Descargar video
              </a>
            </div>
          </div>
        )}

        {type === 'image' && (
          <div className="relative aspect-square">
            <img 
              src={url} 
              alt={`Imagen ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMedia({ url, type: 'image' })}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg hover:bg-white transition-colors font-medium text-sm shadow-lg"
                >
                  <EyeIcon className="w-4 h-4" />
                  Ver
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg hover:bg-white transition-colors font-medium text-sm shadow-lg"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Descargar
                </a>
              </div>
            </div>
          </div>
        )}

        {type === 'file' && (
          <div className="relative aspect-square bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 text-center">
              {url.toLowerCase().endsWith('.pdf') ? (
                <>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                    <DocumentTextIcon className="relative w-20 h-20 text-red-500 drop-shadow-lg" />
                  </div>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider mt-4">
                    Documento PDF
                  </p>
                </>
              ) : url.toLowerCase().match(/\.(doc|docx)$/i) ? (
                <>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                    <DocumentTextIcon className="relative w-20 h-20 text-blue-600 drop-shadow-lg" />
                  </div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-4">
                    Documento Word
                  </p>
                </>
              ) : (
                <>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gray-500/20 blur-2xl rounded-full"></div>
                    <DocumentArrowDownIcon className="relative w-20 h-20 text-gray-600 drop-shadow-lg" />
                  </div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-4">
                    Archivo
                  </p>
                </>
              )}
              <p className="text-xs text-gray-500 mt-2 truncate max-w-[140px] mx-auto">
                {url.split('/').pop()?.split('.')[0]?.substring(0, 20)}...
              </p>
            </div>

            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl transform translate-y-2 group-hover:translate-y-0 hover:scale-105"
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
    <>
      <div className="space-y-8">
        {/* Videos */}
        {videoUrls.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                <VideoCameraIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Videos</h4>
                <p className="text-sm text-gray-500">{videoUrls.length} archivo{videoUrls.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoUrls.map((url, index) => (
                <MediaCard key={url} url={url} type="video" index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Imágenes */}
        {imageUrls.length > 0 && (
          <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                <PhotoIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Imágenes</h4>
                <p className="text-sm text-gray-500">{imageUrls.length} archivo{imageUrls.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {imageUrls.map((url, index) => (
                <MediaCard key={url} url={url} type="image" index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Documentos */}
        {fileUrls.length > 0 && (
          <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Documentos</h4>
                <p className="text-sm text-gray-500">{fileUrls.length} archivo{fileUrls.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {fileUrls.map((url, index) => (
                <MediaCard key={url} url={url} type="file" index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay archivos */}
        {totalFiles === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-3xl blur-xl"></div>
              <DocumentTextIcon className="relative w-20 h-20 mx-auto text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No hay archivos multimedia</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Sube videos, imágenes o documentos para enriquecer el contenido de esta lección
            </p>
          </div>
        )}
      </div>

      {/* Modal para vista previa de imágenes */}
      {selectedMedia && selectedMedia.type === 'image' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all hover:scale-110"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <img 
            src={selectedMedia.url} 
            alt="Vista previa" 
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
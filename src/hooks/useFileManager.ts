import { useState } from 'react';
import { deleteFile, deleteMultipleFiles } from '@/api/FilesAPI';
import { toast } from 'react-toastify';

export const useFileManager = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSingleFile = async (url: string) => {
    setIsDeleting(true);
    try {
      await deleteFile(url);
      toast.success('Archivo eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar archivo');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteFiles = async (urls: string[]) => {
    setIsDeleting(true);
    try {
      const result = await deleteMultipleFiles(urls);
      
      if (result.result.summary.successful > 0) {
        toast.success(`${result.result.summary.successful} archivo(s) eliminado(s) exitosamente`);
      }
      
      if (result.result.summary.failed > 0) {
        toast.warning(`${result.result.summary.failed} archivo(s) no pudieron ser eliminados`);
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting files:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar archivos');
      return null;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSingleFile,
    deleteFiles,
    isDeleting
  };
};
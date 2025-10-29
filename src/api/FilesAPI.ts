import { isAxiosError } from "axios";
import api from "@/lib/axios";

export async function deleteFile(url: string) {
    try {
        const { data } = await api.delete('/files/delete', {
            data: { url }
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar archivo');
    }
}

export async function deleteMultipleFiles(urls: string[]) {
    try {
        const { data } = await api.delete('/files/delete-multiple', {
            data: { urls }
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar archivos');
    }
}

export async function deleteFileFromLesson(
    sectionId: string, 
    lessonId: string, 
    url: string, 
    fileType: 'video' | 'image' | 'file'
) {
    try {
        console.log('🗑️ Deleting file from lesson:', { sectionId, lessonId, url, fileType });
        const { data } = await api.delete(`/files/lesson/${sectionId}/${lessonId}/file`, {
            data: { url, fileType }
        });
        console.log('✅ File deleted successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Error in deleteFileFromLesson:', error);
        if (isAxiosError(error) && error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar archivo de la lección');
    }
}
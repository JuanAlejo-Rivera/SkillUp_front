import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLesson } from '@/api/LessonsAPI';
import { toast } from 'react-toastify';
import type { Lesson, LessonFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import LessonForm from './LessonForm';

export default function ModalLessonAdd() {

    const initialValues: Lesson = {
        _id: "",
        title: "",
        description: "",
        videoUrl: [],
        fileUrl: [],
        imageUrl: []
    }

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({ defaultValues: initialValues })


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tracker = queryParams.get('addLesson');

    const show = tracker ? true : false;

    const params = useParams()
    const courseId = params.courseId!
    const sectionId = params.sectionId!

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createLesson,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] })
            toast.success(data)
            reset()
            navigate(`/courses/${courseId}/sections/${sectionId}/lessons`, {state: location.state})
        }
    })

    const handleForm = (formData: LessonFormData) => {
        const data = {
            formData,
            courseId,
            sectionId
        }
        mutate(data)
    }


    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true, state: location.state })}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10">

                                    <DialogTitle as="h3" className="font-black text-3xl text-slate-700 mb-6">
                                        Agregar nueva lección
                                    </DialogTitle>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit(handleForm)} className="space-y-6">

                                        <LessonForm
                                            register={register}
                                            errors={errors}
                                            setValue={setValue}
                                        />

                                        <div className="flex justify-end">

                                            <input
                                                type="submit"
                                                value='Crear lección'
                                                className="w-full sm:w-auto px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-800 text-white font-medium transition"
                                            />

                                        </div>
                                    </form>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
        </Transition>
    );
}

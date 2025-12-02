import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from 'react';
import type { Section, User, Course } from '@/types/index';
import { canModify } from '../../utils/policies';

type SortableSectionItemProps = {
    section: Section;
    courseId: string;
    courseName: string;
    user: User;
    course: Partial<Course> & { manager: Course['manager'] };
    onDelete: (sectionId: string) => void;
};

export default function SortableSectionItem({
    section,
    courseId,
    courseName,
    user,
    course,
    onDelete,
}: SortableSectionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useSortable({ id: section._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: isDragging ? 0.5 : 1,
    };

    const canDrag = canModify(user, course.manager);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(canDrag ? attributes : {})}
            {...(canDrag ? listeners : {})}
            className={`bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl shadow-xl border-2 border-blue-700/50 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 p-6 flex flex-col justify-between h-full ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
        >
            <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 flex items-center gap-3">
                        {/* Drag indicator */}
                        {canDrag && (
                            <div className="drag-bar" aria-label="Arrastrable">
                                <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-1"></div>
                                <div className="w-4 h-0.5 bg-gray-400 rounded-full mb-1"></div>
                                <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
                            </div>
                        )}
                        <Link
                            to={`/courses/${courseId}/sections/${section._id}/lessons`}
                            className="text-white cursor-pointer hover:text-blue-300 text-2xl font-bold block transition-colors"
                            state={{ courseName: courseName }}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            {section.title}
                        </Link>
                    </div>
                    <Menu as="div" className="relative flex-none z-50" onPointerDown={(e) => e.stopPropagation()}>
                        <MenuButton className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                            <span className="sr-only">opciones</span>
                            <EllipsisVerticalIcon
                                className="h-7 w-7 text-white hover:text-blue-200"
                                aria-hidden="true"
                            />
                        </MenuButton>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="dropdown-menu">
                                <MenuItem>
                                    <Link
                                        to={`/courses/${courseId}/sections/${section._id}/lessons`}
                                        className="dropdown-item"
                                        state={{ courseName: courseName }}
                                    >
                                        Ver Lecciones
                                    </Link>
                                </MenuItem>
                                {canModify(user, course.manager) && (
                                    <>
                                        <MenuItem>
                                            <Link
                                                to={`/courses/${courseId}/sections/${section._id}/edit`}
                                                className="dropdown-item"
                                                state={{ courseName: courseName }}
                                            >
                                                Editar Sección
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                type="button"
                                                className="dropdown-item-danger w-full text-left"
                                                onClick={() => onDelete(section._id)}
                                            >
                                                Eliminar Sección
                                            </button>
                                        </MenuItem>
                                    </>
                                )}
                            </MenuItems>
                        </Transition>
                    </Menu>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">{section.description}</p>

                <Link
                    to={`/courses/${courseId}/sections/${section._id}/lessons`}
                    state={{ courseName: courseName }}
                    className="inline-block mt-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    Ver Lecciones
                </Link>
            </div>
        </div>
    );
}

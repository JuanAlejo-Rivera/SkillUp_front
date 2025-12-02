import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

type SortableLessonWrapperProps = {
  id: string;
  children: ReactNode;
  canDrag: boolean;
};

export default function SortableLessonWrapper({ id, children, canDrag }: SortableLessonWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !canDrag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
    >
      {canDrag && (
        <div 
          className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none"
          aria-label="Arrastrable"
        >
          <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
        </div>
      )}
      {children}
    </div>
  );
}

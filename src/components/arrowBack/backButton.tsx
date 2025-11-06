import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to: string;
  title?: string;
  position?: string; 
  state?: any;
}

export default function BackButton({
  to,
  title = "Volver",
  position = "",
  state
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to, { state })} // 👈 pasamos el state aquí
      title={title}
      className={`${position} flex items-center justify-center w-12 h-12 
      rounded-full bg-gradient-to-b from-sky-600 to-sky-700 shadow-lg 
      shadow-sky-200/40 border border-sky-400/30 
      hover:from-sky-700 hover:to-sky-800 hover:shadow-sky-300/60 
      hover:scale-105 active:scale-95 transition-all duration-200 
      ease-out group`}
    >
      <ArrowLeftIcon
        className="h-6 w-6 text-white drop-shadow-sm 
        group-hover:-translate-x-1 transition-transform duration-200 ease-out"
      />
    </button>
  );
}

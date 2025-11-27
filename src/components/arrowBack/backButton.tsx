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
      className={`${position} flex items-center justify-center w-10 h-10 
      rounded-lg bg-white/90 backdrop-blur-sm shadow-md 
      border border-gray-300 
      hover:bg-white hover:shadow-lg 
      hover:scale-105 active:scale-95 transition-all duration-200 
      ease-out group`}
    >
      <ArrowLeftIcon
        className="h-5 w-5 text-slate-700 
        group-hover:-translate-x-0.5 transition-transform duration-200 ease-out"
      />
    </button>
  );
}

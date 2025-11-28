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
      onClick={() => navigate(to, { state })}
      title={title}
      className={`${position} flex items-center justify-center w-12 h-12 
      rounded-full bg-blue-500 text-white 
      shadow-lg hover:shadow-xl hover:scale-110 active:scale-100 
      transition-transform duration-300 ease-in-out group`}
    >
      <ArrowLeftIcon
        className="h-6 w-6 text-white group-hover:translate-x-1 
        transition-transform duration-300 ease-in-out"
      />
    </button>
  );
}

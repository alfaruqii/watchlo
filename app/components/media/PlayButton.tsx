import { Play } from "lucide-react";

function PlayButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex size-16 items-center justify-center rounded-sm border border-[#e09f3e] bg-[#0d0c0a] text-[#e09f3e] shadow-sleeve transition-transform duration-200 group-hover:scale-110">
        <Play className="size-7 fill-[#e09f3e] text-[#e09f3e]" strokeWidth={2} />
      </div>
    </div>
  );
}

export default PlayButton;

import { useThemeStore } from "@/store/themeStore";

function Rate({ rate = "unknown" }: { rate: string }) {
  const { theme } = useThemeStore();
  return (
    <p
      className={`text-xs uppercase rounded-sm ${
        theme === "garden"
          ? "bg-gray-700 text-gray-200"
          : "bg-red-500 text-black"
      } w-fit px-2 py-1`}
    >
      {rate}
    </p>
  );
}

export default Rate;

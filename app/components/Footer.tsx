"use client";
import { useThemeStore } from "@/store/themeStore";

function Footer() {
  const { theme } = useThemeStore();
  return (
    <>
      <div
        data-testid="footer-container"
        className={`${
          theme === "garden" ? "border-gray-700/20" : "border-gray-300/20"
        } flex flex-col items-center border-t p-4 text-xs`}
      >
        <div>
          <p>
            Disclaimer | Please use this site wisely, dont use it to search some
            inappropriate film, because the purpose of this project is not for
            that, grow up.
          </p>
          <p className="mt-2">Copyright © 2024 Watchlo | Made by faruqi.</p>
        </div>
      </div>
    </>
  );
}

export default Footer;

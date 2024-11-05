import { useThemeStore } from "@/store/themeStore";
import Link from "next/link";
import { GiFilmSpool } from "react-icons/gi";
import { GiShintoShrine } from "react-icons/gi";
import { GiNotebook } from "react-icons/gi";
import { FaSquareGithub } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

function Menu({
  isToggled = false,
  closeMenu,
}: {
  isToggled: boolean;
  closeMenu: () => void;
}) {
  const { theme } = useThemeStore();

  const menuItems = [
    { href: "/", icon: <GiFilmSpool size={24} />, label: "Movies" },
    {
      href: "/anime",
      icon: <GiShintoShrine size={24} />,
      label: "Anime (No ads)",
    },
    { href: "/docs", icon: <GiNotebook size={24} />, label: "Docs" },
    {
      href: "https://github.com/alfaruqii/watchlo",
      icon: <FaSquareGithub size={24} />,
      label: "Github",
      external: true,
    },
  ];

  return (
    <AnimatePresence>
      {isToggled && (
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`
            fixed left-0 right-0 top-12 z-50 w-full overflow-hidden
            border-b pb-2
            ${
              theme === "garden"
                ? "bg-base-100 border-gray-700/20"
                : "bg-black border-gray-300/20"
            }
            drop-shadow-xl 
          `}
        >
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -20, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <button type="button" onClick={() => closeMenu()}>
                <Link
                  href={item.href}
                  {...(item.external ? { target: "_blank" } : {})}
                  className="flex h-full w-full items-center gap-1.5 px-4 py-3 
                           transition duration-100"
                >
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

export default Menu;

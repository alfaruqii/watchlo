"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ToggleTheme } from "./ToggleTheme";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add event listener for scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`sticky top-0 z-50 flex items-center justify-between py-2 px-4 shadow sm:px-12 transition-all duration-300 ${isScrolled ? "bg-base-100/80 backdrop-blur-lg" : "bg-base-100"
          }`}
      >
        <div className="drop-shadow-lg">
          <Link href="/">
            <span className="sm:text-lg ">Watch</span>
            <span className="font-magnatbold sm:text-lg">milo</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm rounded drop-shadow border-2 border-white">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
            </svg>
          </button>
          <ToggleTheme />
        </div>
      </div>
    </>
  );
};


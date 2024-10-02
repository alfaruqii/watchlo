"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/store/themeStore';

const ModalDocs = () => {
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontAskAgain, setDontAskAgain] = useState<boolean>(
    JSON.parse(localStorage.getItem("dontAskAgain") || "false")
  );
  const pathname = usePathname();

  useEffect(() => {
    // Only show the modal if we're on the home page AND dontAskAgain is false
    if (pathname === "/" && !dontAskAgain) {
      setIsOpen(true);
    }
    if (pathname !== "/") {
      closeModal();
    }
  }, [pathname, dontAskAgain]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = () => {
    const newState = !dontAskAgain;
    setDontAskAgain(newState);
    localStorage.setItem('dontAskAgain', JSON.stringify(newState));
  };
  // Checkbox component to reduce redundancy
  const CheckboxComponent = ({ className = "" }) => (
    <div className={`form-control w-fit ${className}`}>
      <label className="label cursor-pointer gap-2 pt-0">
        <input
          checked={dontAskAgain}
          type="checkbox"
          className="checkbox checkbox-sm rounded"
          onChange={handleCheckboxChange}
        />
        <span className="label-text">Don't ask me again</span>
      </label>
    </div>
  );

  return (
    <>
      {isOpen && (
        <dialog id="my_modal_3" className="modal-open modal" open={isOpen}>
          <div className={`modal-box border ${theme === "garden" ? "border-gray-700/60" : "border-gray-600/80"} rounded shadow-lg`}>
            <div className="flex gap-4">
              <div className="w-32">
                <Image alt="Warning Emoji" src="/warning-emoji.webp" width={100} height={100} />
              </div>
              <div>
                <h3 className="-mt-2 font-bold text-warning sm:text-lg">WARNING</h3>
                <p className="pb-1 text-sm sm:text-base text-balance">
                  For best experience please read the <Link href="/docs" className="link">docs</Link> first before playing
                </p>
                <CheckboxComponent className="hidden sm:block" />
              </div>
            </div>
            <div className="modal-action mt-0.5 items-center justify-between sm:justify-end">
              <CheckboxComponent className="block sm:hidden" />
              <form method="dialog">
                <button className="btn btn-sm rounded" onClick={closeModal}>Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ModalDocs;

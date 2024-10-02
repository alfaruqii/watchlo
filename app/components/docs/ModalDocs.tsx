"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/store/themeStore';

const ModalDocs = () => {
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontAskAgain, setDontAskAgain] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage when component mounts
    const storedValue = localStorage.getItem("dontAskAgain");
    const shouldNotShow = JSON.parse(storedValue || "false");
    setDontAskAgain(shouldNotShow);

    // Show modal only on root path and when shouldNotShow is false
    if (pathname === "/" && !shouldNotShow) {
      setIsOpen(true);
    } else {
      // Close modal on any other path
      setIsOpen(false);
    }
  }, [pathname]); // This effect runs whenever pathname changes

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = () => {
    const newState = !dontAskAgain;
    setDontAskAgain(newState);
    localStorage.setItem('dontAskAgain', JSON.stringify(newState));
  };

  // Rest of the component remains the same...
  const CheckboxComponent = ({ className = "" }) => (
    <div className={`form-control w-fit ${className}`}>
      <label className="label cursor-pointer gap-2 pt-0">
        <input
          checked={dontAskAgain}
          type="checkbox"
          className="checkbox checkbox-sm rounded"
          onChange={handleCheckboxChange}
        />
        <span className="label-text">Don&apos;t ask me again</span>
      </label>
    </div>
  );

  return (
    <>
      {isOpen && pathname === "/" && (
        <dialog id="my_modal_3" className="modal-open modal" open={isOpen}>
          <div className={`modal-box border ${theme === "garden" ? "border-gray-700/60" : "border-gray-600/80"} rounded shadow-lg`}>
            {/* Modal content remains the same */}
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

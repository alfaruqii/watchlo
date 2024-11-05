'use client';

import { useModalStore } from '@/store/modalStore';
import { GoSearch } from 'react-icons/go';
import { useState, useCallback, useEffect, useRef } from 'react';
import Searched from './Searched';
import { useDebounce } from '@/hooks/useDebounce';
import { usePathname } from 'next/navigation'; // Use usePathname to track route changes
import { useThemeStore } from '@/store/themeStore';

function ModalSearch() {
  const { isOpen, closeModal } = useModalStore();
  const { theme } = useThemeStore();
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);
  const pathname = usePathname(); // Get current path
  const prevPathnameRef = useRef<string>(pathname); // Store the previous pathname
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input element

  const isWhiteMode = theme === "garden";

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  // Focus the input when the modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]); // Depend on isOpen to trigger focus when modal is opened

  // Close the modal when the path changes
  useEffect(() => {
    if (isOpen) {
      closeModal(); // Close modal if the path changes
    }
  }, [pathname]); // Depend on the pathname to detect changes

  // Clear the search input only if there is a real pathname change
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      setQuery('');  // Clear the search input
      prevPathnameRef.current = pathname; // Update the previous pathname
    }
  }, [pathname]); // Depend on pathname to detect actual path changes

  return (
    <dialog open={isOpen} className={`z-[1000] backdrop-blur-md ${isOpen ? "modal modal-middle modal-open" : "hidden"}`}>
      <div className={`modal-box flex flex-col py-0 px-0 gap-2 bg-opacity-80 rounded-lg border ${isWhiteMode ? "border-gray-700/60" : "border-gray-600/80"} backdrop-blur-lg max-h-96`}>
        <div className={`w-full ${query.length > 0 ? `border-b ${isWhiteMode ? "border-gray-400 " : "border-gray-700 "}` : ""} px-4 py-3`}>
          <label className="input pl-0 h-8 border-none !outline-none flex items-center bg-transparent rounded-none">
            <GoSearch size={20} />
            <input
              ref={inputRef} // Attach the ref to the input element
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="input h-full w-full outline-none border-none placeholder-gray-500"
            />
          </label>
        </div>
        <Searched searchedText={debouncedQuery} />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
}

export default ModalSearch;


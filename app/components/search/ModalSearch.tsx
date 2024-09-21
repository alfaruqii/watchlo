'use client';
import { useModalStore } from '@/store/modalStore';
import SearchIcon from '../icons/SearchIcon';
import { useThemeStore } from '@/store/themeStore';
import { useRef, useState } from 'react';
import Searched from './Searched';

function ModalSearch() {
  const { isOpen, closeModal } = useModalStore();
  const { theme } = useThemeStore();
  const searchedText = useRef<HTMLInputElement>(null); // Correctly typing the ref
  const [query, setQuery] = useState<string>(''); // State to manage the query

  const handleSearch = () => {
    if (searchedText.current) {
      setQuery(searchedText.current.value);
    }
  };

  return (
    <dialog open={isOpen} className={`z-50 ${isOpen ? "modal modal-middle" : "hidden"}`}>
      <div className={`modal-box flex flex-col py-4 gap-4 bg-opacity-75 rounded-lg border ${theme === "garden" ? "border-gray-400" : "border-gray-500"} backdrop-blur-lg max-h-96`}>
        <div className={`border-b pb-1 border-gray-500 w-full`}>
          <label className="input pl-0 h-8 border-none !outline-none flex items-center bg-transparent rounded-none">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              ref={searchedText}
              className="input h-full w-full outline-none border-none placeholder-gray-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
            />
          </label>
        </div>
        <Searched searchedText={query} /> {/* Passing the query as prop */}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
}

export default ModalSearch;


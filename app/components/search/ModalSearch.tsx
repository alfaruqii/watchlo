'use client';
import { useModalStore } from '@/store/modalStore';
import SearchIcon from '../icons/SearchIcon';
import { useThemeStore } from '@/store/themeStore';
import { useState, useCallback } from 'react';
import Searched from './Searched';
import { useDebounce } from '@/hooks/useDebounce';

function ModalSearch() {
  const { isOpen, closeModal } = useModalStore();
  const { theme } = useThemeStore();
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return (
    <dialog open={isOpen} className={`z-50 ${isOpen ? "modal modal-middle" : "hidden"}`}>
      <div className={`modal-box flex flex-col py-4 gap-4 bg-opacity-75 rounded-lg border ${theme === "garden" ? "border-gray-400" : "border-gray-500"} backdrop-blur-lg max-h-96`}>
        <div className={`border-b pb-1 border-gray-500 w-full`}>
          <label className="input pl-0 h-8 border-none !outline-none flex items-center bg-transparent rounded-none">
            <SearchIcon />
            <input
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

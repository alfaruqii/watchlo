import { useThemeStore } from '@/store/themeStore';
import { useModalStore } from '@/store/modalStore';
import SearchIcon from '../icons/SearchIcon';

function ToggleSearch() {
  const { theme } = useThemeStore();
  const { isOpen, openModal, closeModal } = useModalStore();

  const handleToggle = () => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={`${theme === "garden" ? "border-gray-800" : "border-gray-300"} btn btn-sm rounded border-2 drop-shadow`}
      >
        <SearchIcon />
      </button>
    </>
  );
}

export default ToggleSearch;


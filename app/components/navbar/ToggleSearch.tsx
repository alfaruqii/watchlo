import { useThemeStore } from '@/store/themeStore';
import { useModalStore } from '@/store/modalStore';
import { FaSearch } from "react-icons/fa";

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
        <FaSearch size={16} />
      </button>
    </>
  );
}

export default ToggleSearch;


import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ModalDocs from '@/components/docs/ModalDocs';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the useThemeStore
jest.mock('@/store/themeStore', () => ({
  useThemeStore: () => ({
    theme: 'garden',
  }),
}));

describe('ModalDocs Component', () => {
  // Setup localStorage mock
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('displays modal on root path when dontAskAgain is false', () => {
    // Mock the pathname to be root
    const usePathname = jest.requireMock('next/navigation').usePathname;
    usePathname.mockReturnValue('/');

    render(<ModalDocs />);

    const warningText = screen.getByText('WARNING');
    expect(warningText).toBeInTheDocument();

    const docsLink = screen.getByText('docs');
    expect(docsLink).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('does not display modal on non-root path', () => {
    // Mock the pathname to be non-root
    const usePathname = jest.requireMock('next/navigation').usePathname;
    usePathname.mockReturnValue('/some-other-path');

    render(<ModalDocs />);

    const warningText = screen.queryByText('WARNING');
    expect(warningText).not.toBeInTheDocument();
  });

  it('does not display modal when dontAskAgain is true in localStorage', () => {
    // Set dontAskAgain to true in localStorage
    window.localStorage.setItem('dontAskAgain', 'true');

    // Mock the pathname to be root
    const usePathname = jest.requireMock('next/navigation').usePathname;
    usePathname.mockReturnValue('/');

    render(<ModalDocs />);

    const warningText = screen.queryByText('WARNING');
    expect(warningText).not.toBeInTheDocument();
  });
});


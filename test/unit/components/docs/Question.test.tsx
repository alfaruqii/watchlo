import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Question from '@/components/docs/Question';

describe('Question Component', () => {
  it('renders text correctly', () => {
    const testText = 'This is a test question';
    render(<Question text={testText} />);

    const questionElement = screen.getByText(testText);
    expect(questionElement).toBeInTheDocument();
    expect(questionElement).toHaveClass('text-balance');
    expect(questionElement).toHaveClass('font-display');
  });

  it('applies custom class when provided', () => {
    const testText = 'Custom class test';
    const customClass = 'test-custom-class';
    render(<Question text={testText} customClass={customClass} />);

    const questionElement = screen.getByText(testText);
    expect(questionElement).toHaveClass(customClass);
    expect(questionElement).toHaveClass('text-balance');
    expect(questionElement).toHaveClass('font-display');
  });

  it('renders empty heading when no text provided', () => {
    const { container } = render(<Question text="" />);

    const headingElement = container.querySelector('h2');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('');
    expect(headingElement).toHaveClass('text-balance');
    expect(headingElement).toHaveClass('font-display');
  });
});

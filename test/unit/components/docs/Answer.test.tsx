import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Answer from '@/components/docs/Answer';

describe('Answer Component', () => {
  it('renders text correctly', () => {
    const testText = 'This is a test answer';
    render(<Answer text={testText} />);

    const answerElement = screen.getByText(testText);
    expect(answerElement).toBeInTheDocument();
    expect(answerElement).toHaveClass('text-balance');
  });

  it('applies custom class when provided', () => {
    const testText = 'Custom class test';
    const customClass = 'test-custom-class';
    render(<Answer text={testText} customClass={customClass} />);

    const answerElement = screen.getByText(testText);
    expect(answerElement).toHaveClass(customClass);
    expect(answerElement).toHaveClass('text-balance');
  });

  it('renders empty paragraph when no text provided', () => {
    const { container } = render(<Answer text="" />);

    const paragraphElement = container.querySelector('p');
    expect(paragraphElement).toBeInTheDocument();
    expect(paragraphElement).toHaveTextContent('');
    expect(paragraphElement).toHaveClass('text-balance');
  });
});

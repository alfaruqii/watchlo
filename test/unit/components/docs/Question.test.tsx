import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Question from '@/components/docs/Question';

describe('Question Component', () => {
  it('renders text correctly', () => {
    const testText = 'This is a test question';
    render(<Question text={testText} />);

    const questionElement = screen.getByText(testText);
    expect(questionElement).toBeInTheDocument();
    expect(questionElement).toHaveClass('text-pretty');
    expect(questionElement).toHaveClass('font-magnatbold');
    expect(questionElement).toHaveClass('text-xl');
    expect(questionElement).toHaveClass('sm:text-3xl');
  });

  it('applies custom class when provided', () => {
    const testText = 'Custom class test';
    const customClass = 'test-custom-class';
    render(<Question text={testText} customClass={customClass} />);

    const questionElement = screen.getByText(testText);
    expect(questionElement).toHaveClass(customClass);
    expect(questionElement).toHaveClass('text-pretty');
    expect(questionElement).toHaveClass('font-magnatbold');
  });

  it('renders empty string when no text provided', () => {
    const { container } = render(<Question text="" />);

    const paragraphElement = container.querySelector('p');
    expect(paragraphElement).toBeInTheDocument();
    expect(paragraphElement).toHaveTextContent('');
    expect(paragraphElement).toHaveClass('text-pretty');
    expect(paragraphElement).toHaveClass('font-magnatbold');
    expect(paragraphElement).toHaveClass('text-xl');
    expect(paragraphElement).toHaveClass('sm:text-3xl')
  });
});

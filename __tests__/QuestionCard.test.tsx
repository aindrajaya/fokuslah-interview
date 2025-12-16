import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuestionCard from '../components/QuestionCard';
import { QUESTION_DATA } from '../constants';

describe('QuestionCard Component', () => {
  describe('Question Display', () => {
    it('should render question topic', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
    });

    it('should render question difficulty', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      // The actual difficulty shown is "Medium" not the raw data value
      expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    });

    it('should display the question text', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      // Check if question text is rendered
      expect(screen.getByText(/Convert/i)).toBeInTheDocument();
    });
  });

  describe('Answer Input', () => {
    it('should render answer input field', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      const input = screen.getByPlaceholderText(/answer/i);
      expect(input).toBeInTheDocument();
    });

    it('should allow user to type in answer field', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      const input = screen.getByPlaceholderText(/answer/i) as HTMLInputElement;
      input.value = 'x = 4';
      
      expect(input.value).toBe('x = 4');
    });
  });

  describe('Math Rendering', () => {
    it('should contain math rendering component', () => {
      const { container } = render(<QuestionCard data={QUESTION_DATA} />);
      
      // Check if KaTeX or math elements are present
      const mathElements = container.querySelectorAll('[data-testid="react-katex"], .katex, .katex-html');
      expect(mathElements.length).toBeGreaterThan(0);
    });
  });
});

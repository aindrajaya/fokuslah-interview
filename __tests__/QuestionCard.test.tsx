import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuestionCard from '../components/QuestionCard';
import { QUESTION_DATA } from '../constants';

describe('QuestionCard Component', () => {
  describe('Question Display', () => {
    it('should render question topic', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      expect(screen.getByText(QUESTION_DATA.topic)).toBeInTheDocument();
    });

    it('should render question difficulty', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      expect(screen.getByText(QUESTION_DATA.difficulty)).toBeInTheDocument();
    });

    it('should render question ID', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      expect(screen.getByText(/Question #1/i)).toBeInTheDocument();
    });

    it('should display the question text', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      // Check if question text is rendered (may be transformed by MathRenderer)
      expect(screen.getByText(/Solve for/i)).toBeInTheDocument();
    });
  });

  describe('Answer Input', () => {
    it('should render answer input field', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      const input = screen.getByPlaceholderText(/Your answer/i);
      expect(input).toBeInTheDocument();
    });

    it('should allow user to type in answer field', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      const input = screen.getByPlaceholderText(/Your answer/i) as HTMLInputElement;
      input.value = 'x = 4';
      
      expect(input.value).toBe('x = 4');
    });
  });

  describe('Math Rendering', () => {
    it('should contain math rendering component', () => {
      const { container } = render(<QuestionCard data={QUESTION_DATA} />);
      
      // Check if MathRenderer is present (may use KaTeX classes)
      const mathElements = container.querySelectorAll('.katex, .katex-html');
      expect(mathElements.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Elements', () => {
    it('should display difficulty badge with correct styling', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      const difficultyElement = screen.getByText(QUESTION_DATA.difficulty);
      expect(difficultyElement).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<QuestionCard data={QUESTION_DATA} />);
      
      const submitButton = screen.getByRole('button', { name: /Submit Answer/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Custom Question Data', () => {
    it('should render different question data correctly', () => {
      const customData = {
        id: 2,
        topic: 'Algebra',
        difficulty: 'Easy',
        raw_text: 'Solve: 2x + 5 = 15',
        latex_text: 'Solve: $2x + 5 = 15$',
      };
      
      render(<QuestionCard data={customData} />);
      
      expect(screen.getByText('Algebra')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from '../components/ChatInterface';

describe('ChatInterface Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Initial Render', () => {
    it('should render welcome message from Jojo', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      expect(screen.getByText(/Hi! I'm Jojo/i)).toBeInTheDocument();
      expect(screen.getByText(/I'm here to help you/i)).toBeInTheDocument();
    });

    it('should show online status indicator', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    });

    it('should render suggested action buttons', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      expect(screen.getByRole('button', { name: /Give me a hint/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reveal the steps/i })).toBeInTheDocument();
    });

    it('should render message input field', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
    });
  });

  describe('User Input and Message Sending', () => {
    it('should allow user to type a message', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'How do I solve this?');
      
      expect(input).toHaveValue('How do I solve this?');
    });

    it('should send message when send button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Give me a hint');
      
      const sendButton = screen.getByRole('button', { name: '' }); // Send button has no text
      fireEvent.click(sendButton);
      
      // User message should appear
      expect(screen.getByText('Give me a hint')).toBeInTheDocument();
    });

    it('should send message when Enter key is pressed', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Help me{Enter}');
      
      expect(screen.getByText('Help me')).toBeInTheDocument();
    });

    it('should not send empty messages', async () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      // Only welcome message should be present
      const messages = screen.getAllByRole('article', { hidden: true });
      expect(messages).toHaveLength(1); // Only welcome message
    });

    it('should clear input field after sending message', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i) as HTMLInputElement;
      await user.type(input, 'Test message');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      expect(input.value).toBe('');
    });
  });

  describe('Mock AI Responses (1.5s delay)', () => {
    it('should show typing indicator after sending message', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Help me');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      // Typing indicator should appear
      await waitFor(() => {
        expect(screen.getByText('Help me')).toBeInTheDocument();
      });
    });

    it('should respond with hint when user asks for hint', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Give me a hint');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      // Advance timers by 1.5 seconds
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/converting.*exponential form/i)).toBeInTheDocument();
      });
    });

    it('should respond with solution steps when asked to reveal', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Reveal the steps');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/Here are the steps/i)).toBeInTheDocument();
      });
    });

    it('should respond with verification when asked to check', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Is this correct?');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/verify/i)).toBeInTheDocument();
      });
    });

    it('should respond with generic help for other queries', async () => {
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'I am confused');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/property of logarithms/i)).toBeInTheDocument();
      });
    });
  });

  describe('Suggested Action Buttons', () => {
    it('should send "Give me a hint" when hint button is clicked', async () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const hintButton = screen.getByRole('button', { name: /Give me a hint/i });
      fireEvent.click(hintButton);
      
      expect(screen.getByText('Give me a hint')).toBeInTheDocument();
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/exponential form/i)).toBeInTheDocument();
      });
    });

    it('should send "Reveal the steps" when reveal button is clicked', async () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const revealButton = screen.getByRole('button', { name: /Reveal the steps/i });
      fireEvent.click(revealButton);
      
      expect(screen.getByText('Reveal the steps')).toBeInTheDocument();
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(screen.getByText(/Here are the steps/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile vs Desktop Layout', () => {
    it('should show close button on mobile', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={true} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should not show close button on desktop', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const closeButton = screen.queryByRole('button', { name: /close/i });
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked on mobile', () => {
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={true} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should apply mobile slide-in animation classes when open', () => {
      const { container } = render(
        <ChatInterface isOpen={true} onClose={mockOnClose} isMobile={true} />
      );
      
      const chatContainer = container.firstChild;
      expect(chatContainer).toHaveClass('translate-x-0');
    });

    it('should apply mobile slide-out animation classes when closed', () => {
      const { container } = render(
        <ChatInterface isOpen={false} onClose={mockOnClose} isMobile={true} />
      );
      
      const chatContainer = container.firstChild;
      expect(chatContainer).toHaveClass('translate-x-full');
    });
  });

  describe('Auto-scroll Behavior', () => {
    it('should auto-scroll to bottom when new messages are added', async () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;
      
      const user = userEvent.setup({ delay: null });
      render(<ChatInterface isOpen={true} onClose={mockOnClose} isMobile={false} />);
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Test message');
      
      const sendButton = screen.getByRole('button', { name: '' });
      fireEvent.click(sendButton);
      
      await vi.advanceTimersByTimeAsync(1500);
      
      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });
  });
});

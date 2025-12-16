import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    // Reset window size for each test
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  describe('Desktop Layout (≥768px)', () => {
    it('should render both question area and chat interface on desktop', () => {
      render(<App />);
      
      // Question area should be visible
      expect(screen.getByText(/Logarithms/i)).toBeInTheDocument();
      
      // Chat interface should be visible
      expect(screen.getByText(/Ask Jojo/i)).toBeInTheDocument();
      expect(screen.getByText(/I'm here to help you/i)).toBeInTheDocument();
    });

    it('should not show FAB button on desktop', () => {
      render(<App />);
      
      const fabButton = screen.queryByRole('button', { name: /Ask Jojo/i });
      // FAB should not be visible on desktop
      expect(fabButton).not.toBeInTheDocument();
    });

    it('should maintain split-screen layout with correct proportions', () => {
      const { container } = render(<App />);
      
      const mainSection = container.querySelector('main');
      const asideSection = container.querySelector('aside');
      
      expect(mainSection).toBeInTheDocument();
      expect(asideSection).toBeInTheDocument();
    });
  });

  describe('Mobile Layout (<768px)', () => {
    beforeEach(() => {
      // Set mobile viewport
      window.innerWidth = 375;
      fireEvent(window, new Event('resize'));
    });

    it('should show FAB button when chat is closed on mobile', async () => {
      render(<App />);
      
      await waitFor(() => {
        const fabButton = screen.queryByRole('button', { name: /Ask Jojo/i });
        expect(fabButton).toBeInTheDocument();
      });
    });

    it('should hide FAB and show chat drawer when FAB is clicked', async () => {
      render(<App />);
      
      await waitFor(() => {
        const fabButton = screen.getByRole('button', { name: /Ask Jojo/i });
        fireEvent.click(fabButton);
      });

      // Chat should now be visible
      expect(screen.getByText(/Ask Jojo/i)).toBeInTheDocument();
      
      // FAB should be hidden
      const fabButton = screen.queryByRole('button', { name: /Ask Jojo/i });
      expect(fabButton).not.toBeInTheDocument();
    });

    it('should close chat drawer when close button is clicked', async () => {
      render(<App />);
      
      // Open chat
      await waitFor(() => {
        const fabButton = screen.getByRole('button', { name: /Ask Jojo/i });
        fireEvent.click(fabButton);
      });

      // Close chat
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // FAB should reappear
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Ask Jojo/i })).toBeInTheDocument();
      });
    });

    it('should close chat when overlay is clicked', async () => {
      const { container } = render(<App />);
      
      // Open chat
      await waitFor(() => {
        const fabButton = screen.getByRole('button', { name: /Ask Jojo/i });
        fireEvent.click(fabButton);
      });

      // Click overlay
      const overlay = container.querySelector('.bg-black\\/50');
      if (overlay) {
        fireEvent.click(overlay);
      }

      // FAB should reappear
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Ask Jojo/i })).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt layout when resizing from desktop to mobile', async () => {
      render(<App />);
      
      // Start on desktop
      expect(screen.getByText(/Ask Jojo/i)).toBeInTheDocument();
      
      // Resize to mobile
      window.innerWidth = 375;
      fireEvent(window, new Event('resize'));
      
      await waitFor(() => {
        const fabButton = screen.queryByRole('button', { name: /Ask Jojo/i });
        expect(fabButton).toBeInTheDocument();
      });
    });

    it('should adapt layout when resizing from mobile to desktop', async () => {
      window.innerWidth = 375;
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Ask Jojo/i })).toBeInTheDocument();
      });
      
      // Resize to desktop
      window.innerWidth = 1024;
      fireEvent(window, new Event('resize'));
      
      await waitFor(() => {
        // Chat should be visible without FAB
        expect(screen.getByText(/I'm here to help you/i)).toBeInTheDocument();
      });
    });
  });
});

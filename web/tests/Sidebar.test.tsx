import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../src/components/Sidebar';

// Mock lucide-react icons to avoid issues in tests if any
jest.mock('lucide-react', () => ({
    MessageSquare: () => <div data-testid="icon-message-square" />,
    Book: () => <div data-testid="icon-book" />,
    Menu: () => <div data-testid="icon-menu" />,
    Plus: () => <div data-testid="icon-plus" />,
    Settings: () => <div data-testid="icon-settings" />,
    HelpCircle: () => <div data-testid="icon-help-circle" />,
    History: () => <div data-testid="icon-history" />,
    Network: () => <div data-testid="icon-network" />,
    FileText: () => <div data-testid="icon-file-text" />,
}));

describe('Sidebar', () => {
    const mockSetActiveTab = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all navigation items', () => {
        render(<Sidebar activeTab="chat" setActiveTab={mockSetActiveTab} />);
        expect(screen.getByText('Chat')).toBeInTheDocument();
        expect(screen.getByText('Dictionary')).toBeInTheDocument();
        expect(screen.getByText('Grammar')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('highlights the active tab', () => {
        render(<Sidebar activeTab="dictionary" setActiveTab={mockSetActiveTab} />);
        // The active tab usually has a different class or style.
        // We can check if the button containing "Dictionary" has the active class.
        // In the code: isActive ? "bg-primary/10 text-primary" : ...
        const dictionaryButton = screen.getByText('Dictionary').closest('button');
        expect(dictionaryButton).toHaveClass('bg-primary/10');

        const chatButton = screen.getByText('Chat').closest('button');
        expect(chatButton).not.toHaveClass('bg-primary/10');
    });

    it('calls setActiveTab when a nav item is clicked', () => {
        render(<Sidebar activeTab="chat" setActiveTab={mockSetActiveTab} />);
        fireEvent.click(screen.getByText('Resources'));
        expect(mockSetActiveTab).toHaveBeenCalledWith('resources');
    });

    it('collapses and expands when menu button is clicked', () => {
        render(<Sidebar activeTab="chat" setActiveTab={mockSetActiveTab} />);

        // Initially expanded (width 280)
        // We can't easily check width with jsdom, but we can check if text is visible.
        // The text is conditionally rendered: {!isCollapsed && ...}
        expect(screen.getByText('Chat')).toBeInTheDocument();

        // Click menu button
        const menuButton = screen.getByTestId('icon-menu').closest('button');
        fireEvent.click(menuButton!);

        // Now collapsed, text should not be in the document (or hidden)
        // The code removes the span: {!isCollapsed && <span ...>}
        expect(screen.queryByText('Chat')).not.toBeInTheDocument();

        // Click again to expand
        fireEvent.click(menuButton!);
        expect(screen.getByText('Chat')).toBeInTheDocument();
    });
});

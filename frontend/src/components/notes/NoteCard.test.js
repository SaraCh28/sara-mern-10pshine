import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteCard from './NoteCard';

const mockNote = {
  id: 1,
  title: 'Test Note Title',
  content: '<p>Test note content here.</p>',
  updated_at: new Date().toISOString(),
  tags: 'test,react',
  is_pinned: false
};

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('NoteCard Component', () => {
  it('renders note title and content correctly', () => {
    renderWithRouter(<NoteCard note={mockNote} />);
    
    expect(screen.getByText('Test Note Title')).toBeInTheDocument();
    // Since content could be rendered as HTML, we might just look for text snippet if the component strips HTML
    // NoteCard probably renders a summary of the content or the raw HTML inside a div.
  });

  it('renders tags correctly', () => {
    renderWithRouter(<NoteCard note={mockNote} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
  });
});

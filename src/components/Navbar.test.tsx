import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar Component', () => {
  it('renders correctly with brand title', () => {
    render(<Navbar />);

    // Check that brand name is rendered
    expect(screen.getByText('Lab')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
  });

  it('renders the language button and sign in button', () => {
    render(<Navbar />);

    // Check language button is rendered (by checking for "English")
    expect(screen.getByText('English')).toBeInTheDocument();

    // Check sign in button is rendered
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});

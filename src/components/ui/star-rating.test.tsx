import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  it('calls onChange with the clicked star value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('reflects the current value via aria-checked', () => {
    render(<StarRating value={2} onChange={vi.fn()} />);
    expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: '4 stars' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('does not render clickable stars or fire onChange in read-only mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating value={4} onChange={onChange} readOnly />);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(
      screen.getByRole('img', { name: '4 out of 5 stars' }),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('img'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReviewForm } from './ReviewForm';

describe('ReviewForm', () => {
  it('blocks submit and shows an inline error when no rating is selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReviewForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Your review'), 'Great stay!');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('blocks submit and shows an inline error when review text is blank', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReviewForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Please write a review')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with the selected rating and trimmed text once both are valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ReviewForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('radio', { name: '5 stars' }));
    await user.type(screen.getByLabelText('Your review'), '  Loved it!  ');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(5, 'Loved it!');
    expect(
      screen.queryByText('Please select a rating'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Please write a review')).not.toBeInTheDocument();
  });
});

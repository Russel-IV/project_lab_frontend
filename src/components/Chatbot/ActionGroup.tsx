import React from 'react';

export interface ActionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg';
  buttonClassName?: string;
  children: React.ReactNode;
}

export function ActionGroup({
  gap = 'sm',
  buttonClassName,
  children,
  className = '',
  ...props
}: ActionGroupProps) {
  const gapClass = gap === 'sm' ? 'gap-2' : gap === 'md' ? 'gap-4' : 'gap-6';

  const modifiedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && buttonClassName) {
      const existingClassName =
        (child.props as { className?: string }).className || '';
      return React.cloneElement(
        child as React.ReactElement<{ className?: string }>,
        {
          className: `${existingClassName} ${buttonClassName}`.trim(),
        },
      );
    }
    return child;
  });

  return (
    <div className={`flex items-center ${gapClass} ${className}`} {...props}>
      {modifiedChildren}
    </div>
  );
}

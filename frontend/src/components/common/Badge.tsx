import React from 'react';
import clsxm from './lib/clsxm';

// import clsxm from '@/lib/clsxm';


export type BadgeProps = {
  isPrimary?: boolean;
  isSecondary?: boolean;
  isDisabled?: boolean;
} & React.ComponentPropsWithRef<'div'>;

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      children,
      className,
      isPrimary,
      isSecondary,
      ...rest
    }
  ) => {

    return (
      <div
        className={clsxm(
          `${isPrimary ? 'bg-primary-500': isSecondary ? 'bg-gray-200': ''}`,
          `${isPrimary ? 'text-white': isSecondary ? 'text-gray-500': 'text-gray-300'}`,
          'py-1 px-2 rounded-lg text-xs font-semibold',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

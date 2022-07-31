import React from 'react';
import clsxm from './lib/clsxm';

// import clsxm from '@/lib/clsxm';

export type InputProps = {
  isError?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  type?: string;
} & React.ComponentPropsWithRef<'input'>;

export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      children,
      className,
      isError,
      isDisabled = false,
      type,
      placeholder,
      ...rest
    },
    ref
  ) => {

    return (
      <input
        ref={ref}
        disabled={isDisabled}
        placeholder={placeholder}
        className={clsxm(
          'border-1 inline-flex items-center rounded-lg px-4 py-3 text-gray-500 placeholder:text-gray-400',
          'focus:outline-none focus-border-0 focus:ring-0 focus:shadow-lg',
          'shadow-sm',
          'transition-colors duration-75',
          'disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {children}
      </input>
    );
  }
);

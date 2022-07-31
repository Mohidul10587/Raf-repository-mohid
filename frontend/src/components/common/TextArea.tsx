import * as React from 'react';

import clsxm from './lib/clsxm';

export type TextAreaProps = {
  isError?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  type?: string;
} & React.ComponentPropsWithRef<'textarea'>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      <textarea
        ref={ref}
        disabled={isDisabled}
        placeholder={placeholder}
        className={clsxm(
          'border-1 border-gray-100 inline-flex items-center rounded-lg px-4 py-2 text-gray-500 placeholder:text-gray-400 shadow-lg',
          'focus:outline-none focus:border-0 focus:ring-0 focus:shadow-lg',
          'shadow-sm',
          'transition-colors duration-75',
          'disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {children}
      </textarea>
    );
  }
);

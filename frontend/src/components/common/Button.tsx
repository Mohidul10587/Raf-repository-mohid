import React from 'react';
import Link from "next/link";
import { ImSpinner2 } from 'react-icons/im';
import clsxm from './lib/clsxm';

// import clsxm from '@/lib/clsxm';

enum ButtonVariant {
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
}

export type IButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: keyof typeof ButtonVariant;
  icon?: React.ReactNode,
  link?: string,
  href?: string,
} & React.ComponentProps<'button'>;

export const Button: React.FC<IButtonProps> =
  ({
     children,
     className,
     disabled: buttonDisabled,
     isLoading,
     variant = 'primary',
     isDarkBg = false,
     link,
     href,
     ...rest
   }) => {
    const disabled = isLoading || buttonDisabled;

    const button = (
      <button
        type='button'
        disabled={disabled}
        className={clsxm(
          'inline-flex items-center rounded-xl px-4 py-2 font-semibold',
          'focus:outline-none focus-visible:ring focus-visible:ring-primary-500',
          'shadow-sm',
          'transition-colors duration-75',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-500 text-white',
              'border border-primary-600',
              'transition-all hover:bg-primary-600 hover:text-white',
              'active:bg-primary-500',
              'disabled:bg-primary-400 disabled:hover:bg-primary-400',
            ],
            variant === 'outline' && [
              'text-primary-500',
              'border border-primary-500',
              'hover:bg-primary-50 hover:text-white active:bg-primary-100',
              isDarkBg &&
              'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'shadow-none',
              'hover:text-primary-500',
              isDarkBg &&
              'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-white text-dark ',
              'border border-gray-300',
              'hover:bg-gray-100 hover:text-dark',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          'disabled:cursor-not-allowed',
          isLoading &&
          'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'text-white': ['primary', 'dark'].includes(variant),
                'text-black': ['light'].includes(variant),
                'text-primary-500 hover:text-white': [
                  'outline',
                  'ghost',
                ].includes(variant),
              }
            )}
          >
            <ImSpinner2 className='animate-spin' />
          </div>
        )}
        {children}
      </button>
    )

    if (link) {
      return (
        <Link href={link}>{button}</Link>
      );
    }

    if (href) {
      return (
        <a className={className} href={href}>{button}</a>
      );
    }

    return button;
  };

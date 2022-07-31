import React, { useRef } from 'react';
import clsx from 'clsx';

export type IAbstractMenu = {
  open?: boolean;
  onClose: (c: boolean) => void;
  setOpen: (o: boolean) => void;
} & React.ComponentProps<'div'>;

export const AbstractMenu: React.FC<IAbstractMenu> = ({
  open = false,
  setOpen,
  onClose,
  children,
  ...rest
}) => {
  const ref = useRef(null);

  return (
    <div className='z-100 absolute top-2 left-[-24px] min-w-[180px]'>
      <div className='container h-10 w-full' />
      <div
        ref={ref}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => onClose(false)}
        className={clsx(
          'flex cursor-pointer flex-col overflow-hidden bg-white shadow-lg',
          rest.className
        )}
      >
        {children}
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

export type IDrawerProps = {
  width?: number;
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export const Drawer: React.FC<IDrawerProps> = ({
  width = 400,
  open,
  onClose,
  children
}) => {
  const ref = useRef(null);

  return (
    <React.Fragment>
      {open && (
        <>
          <div
            className='drawer-container h-[100vh] w-full fixed bg-black opacity-30 z-10 fixed top-0 left-0 transition-opacity ease-in-out duration-300'
            onClick={onClose}
          />
        </>
      )}
      <div
        ref={ref}
        className={`transform top-0 right-0 w-[400px] bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 flex flex-col ${
          open ? '-translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

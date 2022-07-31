import React from 'react';
import { GiFoxHead } from 'react-icons/gi';
import { AiOutlineCheck } from 'react-icons/ai';
import { AbstractMenu, MenuItem } from '@/components/common';
import { MdLogout } from 'react-icons/md';
import { HiRefresh } from 'react-icons/hi';

type IMyWalletMenuProps = {
  open?: boolean;
  closeMenu: () => void;
};

export const MyWalletMenu: React.FC<IMyWalletMenuProps> = ({
  open,
  closeMenu,
}) => {
  const logoutMetaMask = () => {
    if (typeof window != 'undefined') {
      localStorage.setItem('GraziaMetamask', 'false');
      window.location.reload();
    }
  };

  return (
    <AbstractMenu
      className='top-[36px] rounded-b-xl'
      open={open}
      onClose={closeMenu}
      setOpen={() => false}
    >
      <MenuItem>
        <div className='flex items-center justify-start'>
          <GiFoxHead size={24} className='mr-3' />
          <p className='mr-3'>Metamask</p>
        </div>
        <AiOutlineCheck size={24} className='mr3 text-primary' />
      </MenuItem>
      <MenuItem>
        <div className='flex items-center justify-start'>
          <MdLogout size={24} className='mr-3' />
          <p className='mr-3' onClick={logoutMetaMask}>
            Logout
          </p>
        </div>
      </MenuItem>
      <MenuItem>
        <div className='flex items-center justify-start'>
          <HiRefresh size={24} className='mr-3' />
          <p className='mr-3'>Refresh funds</p>
        </div>
      </MenuItem>
    </AbstractMenu>
  );
};

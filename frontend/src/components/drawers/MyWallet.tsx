import React, { createRef, useState } from 'react';
import { createPopper } from '@popperjs/core';

import { RiArrowDropDownLine } from 'react-icons/ri';
import { GiFoxHead } from 'react-icons/gi';
import { FaUserCircle } from 'react-icons/fa';

import { Badge, Button } from '@/components/common';
import { Drawer } from '@/components/common/Drawer';
import { MyWalletMenu } from '@/components/dropdown-menus/MyWalletMenu';

//my imports
import { WalletContext } from '@/contexts/walletContext';

type MyWalletSidebarProps = {
  open: boolean;
  onClose: () => void;
  children?: null;
};

const MyWalletSidebar: React.FC<MyWalletSidebarProps> = ({
  open = false,
  onClose,
}) => {
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [tooltipShow, setTooltipShow] = useState(false);
  const [showMoreOption, setShowMoreOption] = useState(false);

  const btnRef: any = createRef();
  const tooltipRef: any = createRef();

  const hasWallet = false;

  // my wallet states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [account, setAccount] = useState(null);
  const { wallet, setWalletAddress } = React.useContext(WalletContext);

  const openLeftTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: 'bottom',
    });
    setTooltipShow(true);
  };

  const closeLeftTooltip = () => {
    setTooltipShow(false);
  };

  const openMetamask = async () => {
    setLoading(true);
    const { ethereum } = window;

    const accounts: any = await ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    if (ethereum?.networkVersion !== '13881') {
      const polygon = {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      };

      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...polygon,
            },
          ],
        });

        //set the wallet address to local storage
        localStorage.setItem('GraziaMetamask', 'true');
        setWalletAddress(accounts[0].caveats[0].value[0]);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wallets/add`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletaddress: accounts[0].caveats[0].value[0],
            }),
          }
        );

        const wallet_add = await response.json();

        console.log(wallet_add);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        return setMessage('Failed to change network');
      }
    } else {
      localStorage.setItem('GraziaMetamask', 'true');
      setWalletAddress(accounts[0].caveats[0].value[0]);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallets/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletaddress: accounts[0].caveats[0].value[0],
          }),
        }
      );
    }

    setLoading(false);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <aside className='mt-20'>
        {wallet.walletaddress ? (
          <>
            <div className='flex items-center justify-between border-b p-5'>
              <div className='relative flex cursor-pointer items-center'>
                <div className='mr-3 h-8 w-8 rounded-full bg-primary-500 shadow-lg' />
                <h4 className='mr-2'>My Name</h4>
                <RiArrowDropDownLine
                  size={24}
                  className='text-gray-500'
                  onClick={() => {
                    if (showWalletMenu) {
                      console.log('close wallet menu');
                      return setShowWalletMenu(false);
                    }
                    console.log('open wallet menu');
                    return setShowWalletMenu(true);
                  }}
                />
                {showWalletMenu && (
                  <MyWalletMenu
                    open={showWalletMenu}
                    closeMenu={() => setShowWalletMenu(false)}
                  />
                )}
              </div>
              <div className='relative flex items-center'>
                <button
                  type='button'
                  className='cursor-pointer text-gray-500'
                  onMouseEnter={openLeftTooltip}
                  onMouseLeave={closeLeftTooltip}
                  ref={btnRef}
                >
                  {wallet.walletaddress.slice(0, 6)}...
                  {wallet.walletaddress.slice(-4)}
                </button>
                <span
                  className={`${
                    tooltipShow ? '' : 'hidden'
                  } z-51 absolute top-4 left-9 mt-3 block h-3 w-3 rotate-45 bg-black`}
                />
                <span
                  className={`${
                    tooltipShow ? '' : 'hidden'
                  } absolute top-5 left-0 z-50 mt-3 block max-w-xs rounded-lg border-0 bg-black p-3 text-sm font-normal font-bold text-white`}
                >
                  Copy this
                </span>
              </div>
            </div>
            <div className='my-6 mx-5 flex flex-col items-center rounded-lg border-1 border-gray-200'>
              <p className='mx-auto mt-3 text-sm font-semibold text-gray-500'>
                Total balance
              </p>
              <h4 className='mb-6'>$0.00 USD</h4>
              <Button className='flex w-full items-center justify-center rounded-t-none'>
                Add Funds
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className='flex items-center justify-start border-b p-5'>
              <FaUserCircle size={32} className='mr-3' />
              <h4 className='mr-2'>My Wallet</h4>
            </div>
            <p className='p-5 text-gray-500'>
              Connect with one of our available{' '}
              <span
                className='relative cursor-pointer font-bold text-primary-500'
                // type='button'
                onMouseEnter={openLeftTooltip}
                onMouseLeave={closeLeftTooltip}
                ref={btnRef}
              >
                wallet
                <span
                  className={`${
                    tooltipShow ? '' : 'hidden'
                  } z-51 absolute top-4 right-6 mt-3 block h-3 w-3 rotate-45 bg-black`}
                />
                <span
                  className={`${
                    tooltipShow ? '' : 'hidden'
                  } absolute top-5 -right-6 z-50 mt-3 block w-80 max-w-xs rounded-lg border-0 bg-black p-3 text-sm font-normal font-bold text-white`}
                >
                  A crypto wallet is an application or hardware device that
                  allows individuals to store and retrieve digital items.
                </span>
              </span>
              providers or create a new one.
            </p>
            <div className='m-5 rounded-lg border-1 border-gray-100'>
              <div
                onClick={openMetamask}
                className='flex cursor-pointer  items-center justify-between border-b px-3 py-4 hover:shadow-md'
              >
                <div className='flex items-center justify-start'>
                  <GiFoxHead size={24} className='mr-3' />
                  <p className='mr-3 font-bold'>Metamask Login</p>
                </div>
                <Badge isPrimary={true}>Popular</Badge>
              </div>
              <div className='flex cursor-pointer  items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                <div className='flex items-center justify-start'>
                  <GiFoxHead size={24} className='mr-3' />
                  <p className='mr-3 font-bold'>Coinbase Wallet</p>
                </div>
              </div>
              <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                <div className='flex items-center justify-start'>
                  <GiFoxHead size={24} className='mr-3' />
                  <p className='mr-3 font-bold'>WalletConnect</p>
                </div>
              </div>
              <div className='flex cursor-pointer  items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                <div className='flex items-center justify-start'>
                  <GiFoxHead size={24} className='mr-3' />
                  <p className='mr-3 font-bold'>Phantom</p>
                </div>
                <Badge isPrimary={false} isSecondary={true}>
                  Solana
                </Badge>
              </div>
              {showMoreOption && (
                <>
                  <div className='flex cursor-pointer  items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Formatic</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Kaikas</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Bitski</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer  items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Glow</p>
                    </div>
                    <Badge isPrimary={false} isSecondary={true}>
                      Solana
                    </Badge>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Venly</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Dapper</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Authereum</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Torus</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4 hover:shadow-md'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3' />
                      <p className='mr-3 font-bold'>Portis</p>
                    </div>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3 text-gray-400' />
                      <p className='mr-3 font-bold text-gray-400'>OperaTouch</p>
                    </div>
                    <Badge isPrimary={false} isDisabled={true}>
                      mobile only
                    </Badge>
                  </div>
                  <div className='flex cursor-pointer items-center justify-between border-b px-3 py-4'>
                    <div className='flex items-center justify-start'>
                      <GiFoxHead size={24} className='mr-3 text-gray-400' />
                      <p className='mr-3 font-bold text-gray-400'>Trust</p>
                    </div>
                    <Badge isPrimary={false} isDisabled={true}>
                      mobile only
                    </Badge>
                  </div>
                </>
              )}
              <div className='flex cursor-pointer  items-center justify-between px-3 py-4 hover:shadow-md'>
                <div
                  className='flex w-full items-center justify-center'
                  onClick={() => setShowMoreOption(!showMoreOption)}
                >
                  <p className='mr-3 font-bold text-gray-500'>
                    {showMoreOption ? 'Show less options' : 'Show more options'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </Drawer>
  );
};

export default MyWalletSidebar;

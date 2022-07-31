import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaDiscord, FaEye, FaHeart, FaInstagram, FaMoon, FaRedditAlien, FaSearch, FaTiktok, FaTwitter, FaUser, FaYoutube } from 'react-icons/fa';
import { ImGift, ImMusic } from 'react-icons/im';
import { BsMouse2Fill } from 'react-icons/bs';
import { GiVirtualMarker } from 'react-icons/gi';
import { BiHomeHeart, BiWorld, BiCollection } from 'react-icons/bi';
import {
  MdSportsFootball,
  MdBusinessCenter,
  MdOutlinePhotoCamera,
} from 'react-icons/md';
import { FiSettings } from 'react-icons/fi'




if (typeof window !== 'undefined') {
 
  
  const toggle:any = document.getElementById('toggle')
  const sidebar:any = document.getElementById('sidebar')


  document.onclick = function (e:any) {
    if (e.target.id !== 'toggle' && e.target.id !== 'sidebar' ) {
    
      sidebar.classList.remove('active')
    }
  }

  toggle.onclick = function () {
    {
    
      sidebar.classList.toggle('active')
    }
  } 
}

const Navbar = () => {
  const [showWallet, setShowWallet] = useState(false);
  
  return (
    <div  >
      <header>
        <div className='fixed z-50 flex w-full  justify-between  bg-white p-4 shadow-lg'>
          <div>
            <h1 className='text-primary text-2xl font-bold'>SmartXNFT</h1>
          </div>
          <div className='flex items-center justify-evenly border border-black  p-3 rounded-md'>
            <FaSearch />
            <span>
              <input
                className='ml-2 outline-none '
                placeholder='Search items collections and accounts'
                type='text'
              />
            </span>
          </div>

          <div className='text-md flex items-center justify-between'>
            <div className='dropdown  mx-3'>
              <button className='dropbtn border-none text-center'>
                Explore
              </button>
              <div className='dropdown-content'>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <ImGift className='text-primary  ' />
                        <p className='ml-2'>All NFTs</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <BiHomeHeart className='text-primary' />
                        <p className='ml-2'>Arts</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <BiCollection className='text-primary' />
                        <p className='ml-2'>Collectibles</p>
                      </div>
                    </a>
                  </Link>
                </div>

                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <BiWorld className='text-primary' />
                        <p className='ml-2'>Domain Names</p>
                      </div>
                    </a>
                  </Link>
                </div>

                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <ImMusic className='text-primary' />
                        <p className='ml-2'>Music</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='ml-0 flex items-center'>
                        <MdOutlinePhotoCamera className='text-primary text-xl' />
                        <p className='ml-2'>Photography</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <MdSportsFootball className='text-primary' />
                        <p className='ml-2'>Sports</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <MdBusinessCenter className='text-primary' />
                        <p className='ml-2'>Trading Cards</p>
                      </div>
                    </a>
                  </Link>
                </div>

                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <BsMouse2Fill className='text-primary' />
                        <p className='ml-2'>Utility</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <GiVirtualMarker className='text-primary' />
                        <p className='ml-2'>Virtual Worlds</p>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className=' dropdown  mx-3'>
              <button className='dropbtn  border-none'>Status</button>
              <div className='dropdown-content'>
                <a href='#'>Ranking</a>
                <a href='#'>Activities</a>
              </div>
            </div>
            <div className='dropdown  mx-3'>
              <button className='dropbtn  border-none'>Recourse</button>
              <div className='dropdown-content' >
                <Link href='#'>
                  <a href='#'>Help Center</a>
                </Link>
                <Link href='#'>
                  <a href='#'>Platform status</a>
                </Link>
                <Link href='#'>
                  <a href='#'>Patterns</a>
                </Link>
                <Link href='#'>
                  <a href='#'>Gas-Free Marketplace</a>
                </Link>
                <Link href='#'>
                  <a href='#'>Taxes</a>
                </Link>
                <Link href='#'>
                  <a href='#'>Docs</a>
                </Link>
                <Link href='#'>
                  <a href='#'>Newsletter</a>
                </Link>

                <Link href='#'>
                  <a href='#'>Blogs</a>
                </Link>

                <span className='flex pl-2'>

                  <a style={{ padding: '0px 6px', border: 'none', fontSize: '22px', color: 'gray' }} href='#'>
                    <FaTwitter />
                  </a>


                  <a style={{ padding: '0px 6px', border: 'none', fontSize: '22px', color: 'gray' }} href='#'>
                    <FaInstagram />
                  </a>
                  <a style={{ padding: '0px 6px', border: 'none', fontSize: '22px', color: 'gray' }} href='#'>
                    <FaDiscord />
                  </a>
                  <a style={{ padding: '0px 6px', border: 'none', fontSize: '22px', color: 'gray' }} href='#'>
                    <FaYoutube />
                  </a>
                  <a style={{ padding: '0px 6px', border: 'none', fontSize: '22px', color: 'gray' }} href='#'>
                    <FaTiktok />
                  </a>
                  <a style={{ padding: '0px 6px', border: 'none', fontSize: '22px', color: 'gray' }} href='#'>
                    <FaRedditAlien />
                  </a>



                </span>
              </div>
            </div>
            <div className='mx-2'>
              <p className='menu-btn'>Create</p>
            </div>
            <div className='dropdown  mx-3'>
              <button className='dropbtn border-none text-center'>
                <svg
                  stroke='currentColor'
                  fill='none'
                  stroke-width='2'
                  viewBox='0 0 24 24'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='cursor-pointer  hover:text-black'
                  height='24'
                  width='24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                  <circle cx='12' cy='7' r='4'></circle>
                </svg>
              </button>
              <div className='dropdown-content'>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <FaUser className='text-primary  ' />
                        <p className='ml-2'>Profile</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <FaHeart className='text-primary' />
                        <p className='ml-2'>Favorites</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <FaEye className='text-primary' />
                        <p className='ml-2'>Watchlist</p>
                      </div>
                    </a>
                  </Link>
                </div>

                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <BiWorld className='text-primary' />
                        <p className='ml-2'>My collections</p>
                      </div>
                    </a>
                  </Link>
                </div>

                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='flex items-center'>
                        <FiSettings className='text-primary' />
                        <p className='ml-2'>Setting</p>
                      </div>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href='#'>
                    <a href='#'>
                      <div className='ml-0 flex items-center'>
                        <FaMoon className='text-primary text-xl' />
                        <p className='ml-2'>Night Mode</p>
                      </div>
                    </a>
                  </Link>
                </div>

              </div>
            </div>

            <div className='mx-3 '>
              <svg
                id='toggle'
                stroke='currentColor'
                fill='currentColor'
                stroke-width='0'
                viewBox='0 0 24 24'
                className='relative cursor-pointer menu-btn hover:text-black'
              
                height='24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M20 3H5C3.346 3 2 4.346 2 6v12c0 1.654 1.346 3 3 3h15c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19c-.552 0-1-.449-1-1V6c0-.551.448-1 1-1h15v3h-6c-1.103 0-2 .897-2 2v4c0 1.103.897 2 2 2h6.001v3H5zm15-9v4h-6v-4h6z'></path>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div id="sidebar">



     <aside  className='relative top-16 left-3'
         
        >
          <div id='aside' className='flex items-center'>
            {' '}
            <p>
              <FaUser className='rounded-full border border-gray-800 bg-gray-600 p-1 text-3xl text-white' />
            </p>
            <p className='ml-2 text-lg font-extrabold '>My Wallet</p>
          </div>

          <p className='my-6 text-xl text-gray-600'>
            Connect with one of our available{' '}
            <span className='font-extrabold text-blue-600 '>wallet</span>{' '}
            providers or create a new one.
          </p>

          <div className='flex items-center  rounded-md  border border-white hover:border-gray-400  justify-between'>
            <div className=' flex items-center  p-3 text-lg font-extrabold '>
              <Image
                src='/metamask-fox.svg'
                height={25}
                width={25}
                alt='metamask'
              ></Image>
              <p className='ml-3'>Metamask</p>
            </div>
            <p className='relative right-3 rounded-md text-xs text-white  py-1 px-2 bg-blue-700 mr-2'>Popular</p>
          </div>
          <div className='my-3 flex items-center rounded-md border border-white p-3 text-lg font-extrabold hover:border-gray-400 '>
            <Image
              src='/walletlink.webp'
              height={25}
              width={25}
              alt='metamask'
            ></Image>
            <p className='ml-3'>Coinbase Wallet</p>
          </div>
          <div className='my-3 flex items-center rounded-md border border-white p-3 text-lg font-extrabold hover:border-gray-400 '>
            <Image
              src='/walletconnect.webp'
              height={25}
              width={25}
              alt='metamask'
            ></Image>
            <p className='ml-3'> WalletConnect</p>
          </div>
          <div className='my-3 flex items-center rounded-md border border-white p-3 text-lg font-extrabold hover:border-gray-400 '>
            <Image
              src='/phantom.svg'
              height={25}
              width={25}
              alt='metamask'
            ></Image>
            <p className='ml-3'>Phantom</p>
          </div>
          <div className='my-3 flex items-center rounded-md border border-white p-3 text-lg font-extrabold hover:border-gray-400 '>
            <Image src='/glow.svg' height={25} width={25} alt='metamask'></Image>
            <p className='ml-3'>Glow</p>
          </div>
        </aside> 

</div>

    </div>
  );
};

export default Navbar;
function setWallet(arg0: boolean): MouseEvent {
  throw new Error('Function not implemented.');
}

function setShowWallet(arg0: boolean): ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null {
  throw new Error('Function not implemented.');
}


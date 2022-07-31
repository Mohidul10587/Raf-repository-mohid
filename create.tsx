import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { LoadingContext } from '@/contexts/loadingContext';
import { checkMimeType } from '@/utils/checkMimeType';
import { convert2Base64 } from '@/utils/convert2Base64';
import {
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
} from '@/utils/drag-drop';

import abidata from '../../../../solidity-contracts/artifacts/contracts/NFTWithOutCashback.sol/NFTWithOutCashback.json';

import { ICollection, IVerifyItem } from '@/types';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

type Inputs = {
  wallet: string;
  tokenId: string;
  media: string;
  media_type: string;
  name: string;
  url: string;
  link: string;
  description: string;
  collective: string;
  royalty: string;
  explicit: boolean;
  signature: string;
  contractaddress: string | undefined;
  creation_hash: string | undefined;
};

const CreateItem = () => {
 const router = useRouter();
  const { loader, setLoadingState } = React.useContext(LoadingContext);
  const [collections, setCollections] = React.useState([] as ICollection[]);
  const [dragDrop, setDragDrop] = React.useState({
    media: true,
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoadingState(true);

    const web3 = new Web3(window.ethereum);
    try {
      //create a signer to save in db
      const nonce = await web3.eth.getTransactionCount(
        window.ethereum.selectedAddress
      );
      const signer = await web3.eth.personal.sign(
        nonce.toString(),
        window.ethereum.selectedAddress,
        nonce.toString()
      );

      //assign value to unassigned datas
      data.signature = signer;
      data.wallet = window.ethereum.selectedAddress;
      data.contractaddress = data.collective;
      data.creation_hash = '';

      //upload the image to IPFS
      const responseItem = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/items/`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const item = await responseItem.json();

      console.log('w', item);

      const contract = new web3.eth.Contract(
        abidata.abi as AbiItem[],
        data.collective
      );

      const tx = await contract.methods
        .mintWithTokenURI(
          window.ethereum.selectedAddress,
          Number(item.tokenid),
          item.metadata
        )
        .send(
          {
            from: window.ethereum.selectedAddress,
            nonce: nonce,
            gasPrice: web3.utils.toHex(web3.utils.toWei('90', 'gwei')),
            gasLimit: web3.utils.toHex(9000000),

            data: contract.methods.mintWithTokenURI(
              window.ethereum.selectedAddress,
              Number(item.tokenid),
              item.metadata
            ),
          }
          //,
          //   (err: any, res: any) => {
          //     if (err) {
          //       console.log(err);
          //     } else {
          //       console.log(res);
          //     }
          //   }
        )
        .on('transactionHash', async (hash: string) => {
          data.creation_hash = hash;
          console.log(hash);
        })
        .on('receipt', (receipt: any) => {
          console.log(receipt);
        })
        .on('confirmation', (confirmationNumber: any, receipt: any) => {
          console.log(confirmationNumber, receipt);
        })
        .on('error', (error: any) => {
          console.log(error);
        });

      console.log('tx', tx);

      console.log('contract');
      const verifier: IVerifyItem = {
        signature: signer,
        wallet: data.wallet,
        tokenId: Number(data.tokenId),
        contractAddress: data.collective,
        creation_hash: data.creation_hash,
      };
      console.log('verifier', verifier);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/items/verify/${verifier.contractAddress
        }/${Number(verifier.tokenId)}}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifier),
        }
      );
      console.log('response', response);
      const json = await response.json();
      if (json.status == 200) {
        //console.log(json);
        return router.push(`/collections/${json.smartContract._id}`);
      }

      setLoadingState(false);
    } catch (err) {
      console.log(err);
      setLoadingState(false);
    }
  };

  React.useEffect(() => {
    const getCollections = async () => {
      try {
        //* uncomment when smartcontracts are ready - done
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/collections/${window.ethereum.selectedAddress}`
        );
        const { collectives } = await res.json();
        console.log(collectives);
        setCollections(collectives);
      } catch (err) {
        setCollections([]);
      }
    };
    getCollections();
  }, []);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <section className='bg-white  pt-32 sm:pb-20 pb-8 flex justify-center'>
        <div className='xl:max-w-5xl max-w-3xl'>
          <div>
            {/* className='md:w-10/12 lg:8/12 xl:w-6/12' */}


            <h1 className='text-4xl font-bold ml-6'>Create New Item</h1>
            <p className='ml-6 text-xs mt-6'> Required fields</p>
            <div>

              <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
                <div className='shadow sm:overflow-hidden sm:rounded-md'>



                  <div className='bg-white  pt-3 sm:px-6'>

                    {/* Media */}
                    <div>
                      <p className='font-bold text-gray-700'>Image, Video, Audio, or 3D Model</p>
                      <label className='block text-xs mt-1 text-gray-700'>
                        File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB
                      </label>
                      <div
                        onDrop={async (e) => {
                          const file = await handleDrop(e);

                          setDragDrop({ ...dragDrop, media: false });
                          setValue('media', file.data);
                          setValue('media_type', file.mime);
                        }}
                        onDragOver={(e) => handleDragOver(e)}
                        onDragEnter={(e) => handleDragEnter(e)}
                        onDragLeave={(e) => handleDragLeave(e)}
                        className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'
                      >
                        {dragDrop.media ? (
                          <div className='space-y-1 text-center'>
                            <svg
                              className='mx-auto h-12 w-12 text-gray-400'
                              stroke='currentColor'
                              fill='none'
                              viewBox='0 0 48 48'
                              aria-hidden='true'
                            >
                              <path
                                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                                strokeWidth={2}
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <div className='flex text-sm text-gray-600'>
                              <label
                                htmlFor='file-upload'
                                className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'
                              >
                                <span
                                  onClick={() =>
                                    document.getElementById('media')?.click()
                                  }
                                >
                                  Upload a file
                                </span>
                                <input
                                  id='media'
                                  type='file'
                                  className='sr-only'
                                  {...register('media', {
                                    required: {
                                      value: true,
                                      message: 'Please upload a file',
                                    },
                                  })}
                                  onInput={async (e) => {
                                    //get the file from the input of react-hook-form
                                    e.preventDefault();
                                    if (e.currentTarget && e.currentTarget.files) {
                                      const file = e.currentTarget.files[0];

                                      //conver to base64
                                      const base64 = await convert2Base64(file);

                                      setDragDrop({ ...dragDrop, media: false });
                                      setValue('media', base64);
                                    }
                                  }}
                                />
                              </label>
                              <p className='pl-1'>or drag and drop</p>
                            </div>
                            <p className='text-xs text-gray-500'>
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        ) : (
                          <div className='space-y-1 text-center'>
                            {checkMimeType(getValues('media')).includes(
                              'image'
                            ) && (
                                <Image
                                  src={getValues('media')}
                                  alt='logo'
                                  className='rounded-md'
                                  width={200}
                                  height={200}
                                />
                              )}

                            {checkMimeType(getValues('media')).includes(
                              'video'
                            ) && (
                                <video width='200' height='200' controls>
                                  <source src={getValues('media')} type='video/mp4' />
                                  Error Message
                                </video>
                              )}

                            {checkMimeType(getValues('media')).includes(
                              'audio'
                            ) && (
                                <audio controls>
                                  <source src={getValues('media')} type='audio/ogg' />
                                  <source
                                    src={getValues('media')}
                                    type='audio/mpeg'
                                  />
                                  Error Message
                                </audio>
                              )}

                            <div className='flex text-sm text-gray-600'>
                              <p
                                className='cursor-pointer pl-1'
                                onClick={() => {
                                  setDragDrop({ ...dragDrop, media: true });
                                  setValue('media', '');
                                }}
                              >
                                Cancel
                              </p>
                            </div>
                          </div>
                        )}

                        {errors.media && (
                          <p className='text-xs text-red-500'>
                            {errors.media.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* name */}
                    <div className='mt-4'>
                      {' '}
                      <div>
                        <label
                          htmlFor='name'
                          className=' font-bold text-gray-700'
                        >
                          Name
                        </label>
                        <input
                          type='text'
                          id='name'
                          autoComplete='given-name'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='Name'
                          {...register('name', {
                            required: {
                              value: true,
                              message: 'Please enter a name',
                            },
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                            maxLength: {
                              value: 200,
                              message: 'Name must be at most 200 characters',
                            },
                          })}
                        />
                        {errors.name && (
                          <p className='text-xs text-red-500'>
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* url */}

                    <div className='mt-4'>
                      <div>
                        <label
                          htmlFor='url'
                          className=' font-bold text-gray-700'
                        >
                          URL
                        </label>
                        <div className='mt-1 flex rounded-md shadow-sm'>
                          <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                            http://
                          </span>
                          <input
                            type='text'
                            id='url'
                            className='block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            placeholder='www.example.com'
                            {...register('url')}
                          />

                          {errors.url && (
                            <p className='text-xs text-red-500'>
                              {errors.url.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* extarnel link */}

                    <div  className='mt-4'>
                      <div>
                      
                       <label
                          htmlFor='link'
                          className='font-bold text-gray-700'
                        >
                          External Link
                        </label>
                        <div className='mt-1 flex rounded-md shadow-sm'>
                      
                          <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                            http://
                          </span>
                          <input
                            type='text'
                            id='link'
                            className='block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            placeholder='www.example.com'
                            {...register('link')}
                          />
                      

                          {errors.link && (
                            <p className='text-xs text-red-500'>
                              {errors.link.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>


                    {/* Description */}
                    <div  className='mt-4'>
                      <label
                        htmlFor='description'
                        className='font-bold text-gray-700'
                      >
                        Description
                      </label>
                      <div className='mt-1'>
                        <textarea
                          id='description'
                          rows={3}
                          className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='Details about the item'
                          defaultValue=''
                          {...register('description', {
                            required: {
                              value: true,
                              message: 'Please enter a description',
                            },
                            minLength: {
                              value: 2,
                              message: 'Description must be at least 2 characters',
                            },
                            maxLength: {
                              value: 1500,
                              message:
                                'Description must be at most 1500 characters',
                            },
                          })}
                        />
                        {errors.description && (
                          <p className='text-xs text-red-500'>
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  

                  {/* collection */}


                  <div  className='mt-4'>
                    <div >
                      <label
                        htmlFor='collective'
                        className='font-bold text-gray-700'
                      >
                        Collection
                      </label>
                      <div className='flex items-center'>
                        <p className='text-xs text-gray-700'>This is the collection where your item will appear.</p>
                        <div className='group relative'>

                          <svg className='ml-2 rounded-full border border-black' height='13px' width='13px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M160 448h-32V224c0-17.69-14.33-32-32-32L32 192c-17.67 0-32 14.31-32 32s14.33 31.1 32 31.1h32v192H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32S177.7 448 160 448zM96 128c26.51 0 48-21.49 48-48S122.5 32.01 96 32.01s-48 21.49-48 48S69.49 128 96 128z" /></svg>
                          <div className='group-hover:block hidden absolute -top-28 w-60 -right-28   rounded-lg pb-6'>

                            <div className=' bg-black px-3 py-2 text-center text-white rounded-lg '><p className='text-sm'>Moving items to a different collection may take up to 30 minutes. You can <span className='text-blue-500'>manage your collections here</span> .</p>
                              <div className='relative flex justify-center'>  <div className='absolute w-3.5 rotate-45  h-3.5 bg-black'></div></div>
                            </div>
                          </div>

                        </div>
                      </div>
                      <select
                        id='collective'
                        className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                        {...register('collective', {
                          required: {
                            value: true,
                            message: 'Please select a collection',
                          },
                        })}
                      >
                        <option value='' defaultValue=''>
                          Select a collection
                        </option>
                        {collections?.map((collection) => (
                          <option
                            key={collection._id}
                            value={collection.contractAddress}
                          >
                            {collection.name}
                          </option>
                        ))}
                      </select>
                      {errors.collective && (
                        <p className='text-xs text-red-500'>
                          {errors.collective.message}
                        </p>
                      )}
                    </div>
                  </div>
</div>
                  {/* Properties */}

               <div className='px-10 mt-4'>
               <div className='flex justify-between  mb-12'>
                    <div className='flex'>
                      <svg height='14px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z" /></svg>

                      <div className='ml-3 -mt-1'>
                        <p className='text-sm font-bold'>Properties</p>
                        <p className='text-sm'>Numerical traits that show as a progress bar</p>
                      </div>
                    </div>

                    <div className='border border-gray-400 rounded-lg p-0.5 flex items-center px-2'>
                      <svg height='16px' width='16px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z" /></svg>
                    </div>
                  </div>

                  {/* Level */}

                  <div className='flex justify-between mb-12'>
                    <div className='flex'>
                      <svg height='14px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" /></svg>

                      <div className='ml-3 -mt-1'>
                        <p className='text-sm font-bold'>Level</p>
                        <p className='text-sm'>Textual traits that show up as rectangles</p>
                      </div>
                    </div>
                    <div className='border border-gray-400 rounded-lg p-0.5 flex items-center px-2'>
                      <svg height='16px' width='16px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z" /></svg>
                    </div>
                  </div>


                  {/* Status */}

                  <div className='flex justify-between  mb-12'>
                    <div className='flex'>
                      <svg height='14px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M544 0c-17.67 0-32 14.33-32 31.1V480C512 497.7 526.3 512 544 512s32-14.33 32-31.1V31.1C576 14.33 561.7 0 544 0zM160 288C142.3 288 128 302.3 128 319.1v160C128 497.7 142.3 512 160 512s32-14.33 32-31.1V319.1C192 302.3 177.7 288 160 288zM32 384C14.33 384 0 398.3 0 415.1v64C0 497.7 14.33 512 31.1 512S64 497.7 64 480V415.1C64 398.3 49.67 384 32 384zM416 96c-17.67 0-32 14.33-32 31.1V480C384 497.7 398.3 512 416 512s32-14.33 32-31.1V127.1C448 110.3 433.7 96 416 96zM288 192C270.3 192 256 206.3 256 223.1v256C256 497.7 270.3 512 288 512s32-14.33 32-31.1V223.1C320 206.3 305.7 192 288 192z" /></svg>

                      <div className='ml-3 -mt-1'>
                        <p className='text-sm font-bold'>Status</p>
                        <p className='text-sm'>Textual traits that show up as rectangles</p>
                      </div>
                    </div>
                    <div className='border border-gray-400 rounded-lg p-0.5 flex items-center px-2'>
                      <svg height='16px' width='16px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z" /></svg>
                    </div>
                  </div>

                  {/* Unlockable Content */}
                  
                  <div className=' mb-12'>
                    <div className='flex justify-between'>
                      <div className='flex'>
                        <svg height='14px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z" /></svg>

                        <div className='ml-3 -mt-1'>
                          <p className='text-sm font-bold'>Unlockable Content</p>
                          <span className='text-sm '>Include unlockable content that can  </span>
                          <span className='text-sm md:inline block'>only be revealed by the owner br of the item.</span>
                        </div>
                      </div>
                      <div onClick={() => setTranslate(!translate)} className={translate ? 'border border-gray-400 bg-blue-500  rounded-xl  w-12 h-7   relative' : 'border border-gray-400 bg-gray-500  rounded-xl  w-12 h-7   relative'} >
                        <div className={translate ? 'bg-white transition-all duration-300 rounded-full w-4 h-3.5 absolute top-1.5  translate-x-6 ' : 'bg-white transition-all duration-300 rounded-full w-4 h-3.5  absolute top-1.5 translate-x-1'}></div>
                      </div>

                    </div>

                    <textarea className={translate ? 'h-32  mt-1  w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm block' : 'hidden mt-1  w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm '} placeholder='Enter content(access key ,code to reddem , link to a file ,etc)' />

                  </div>
                  {/* Explicit & Sensitive Content */}

                  <div className='flex justify-between  mb-6'>
                    <div className='flex'>
                      <svg height='14px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z" /></svg>

                      <div className='ml-3 -mt-1'>
                         <p className='text-sm font-bold'>Explicit & Sensitive Content</p>

                  <div className='sm:flex '>
                        <p className='text-sm'>Set this item </p>
                        <div className='flex items-center'>
                          <p className='text-sm'>as explicit and sensitive content</p>
                          <div className='inline group relative'>
                            <svg className='ml-2 rounded-full border border-black' height='13px' width='13px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M160 448h-32V224c0-17.69-14.33-32-32-32L32 192c-17.67 0-32 14.31-32 32s14.33 31.1 32 31.1h32v192H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32S177.7 448 160 448zM96 128c26.51 0 48-21.49 48-48S122.5 32.01 96 32.01s-48 21.49-48 48S69.49 128 96 128z" /></svg>
                            <div className='group-hover:block hidden absolute -top-[150px] w-80 text-sm -right-[153px] z-10  rounded-lg pb-6'>
                              <div className=' bg-black px-3 py-2 text-center text-white rounded-lg '><p className='text-center'>Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing SmartXNFT.</p>
                                <p className='text-blue-500'> Learn more about explicit content at SmartXNFT here.</p>
                                <div className='relative flex justify-center'>
                                  <div className='absolute w-3.5 rotate-45  h-3.5 bg-black'></div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                  </div>



                      </div>
                    </div>

                    <div onClick={() => setTranslate2(!translate2)} className={translate2 ? 'border border-gray-400 bg-blue-500  rounded-xl  w-12 h-7   relative' : 'border border-gray-400 bg-gray-500  rounded-xl  w-12 h-7   relative'} >
                      <div className={translate2 ? 'bg-white transition-all duration-300 rounded-full w-4 h-3.5 absolute top-1.5  translate-x-6 ' : 'bg-white transition-all duration-300 rounded-full w-4 h-3.5  absolute top-1.5 translate-x-1'}></div>
                    </div>
                  </div>
               </div>

                  {/* supply */}

                  <div className='bg-white py-5 sm:p-6'>
                    <div className='col-span-6 sm:col-span-3'>
                      <label

                        className='font-bold text-gray-700'
                      >
                        Supply
                      </label>
                      <div className='flex items-center'>
                        <p className='text-xs text-gray-700'>The number of items that can be minted. No gas cost to you!.</p>
                        <div className=' relative'>
                          <svg className='ml-2 rounded-full border border-black' height='13px' width='13px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M160 448h-32V224c0-17.69-14.33-32-32-32L32 192c-17.67 0-32 14.31-32 32s14.33 31.1 32 31.1h32v192H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32S177.7 448 160 448zM96 128c26.51 0 48-21.49 48-48S122.5 32.01 96 32.01s-48 21.49-48 48S69.49 128 96 128z" /></svg>
                          <div className='group-hover:block hidden absolute -top-32 w-60 -right-28   rounded-lg pb-6'>
                          </div>

                        </div>
                      </div>
                      <input className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm' type="number" />
                    </div>
                  </div>

                  {/* Freeze metadata*/}

                  <div className='bg-white py-5 sm:p-6'>
                    <div className='col-span-6 sm:col-span-3'>
                      <div className='flex items-center'>
                        <label className='font-bold text-gray-700'> Freeze metadata </label>
                        <div className='group relative'>
                          <svg className='ml-2 rounded-full border border-black' height='13px' width='13px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M160 448h-32V224c0-17.69-14.33-32-32-32L32 192c-17.67 0-32 14.31-32 32s14.33 31.1 32 31.1h32v192H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32S177.7 448 160 448zM96 128c26.51 0 48-21.49 48-48S122.5 32.01 96 32.01s-48 21.49-48 48S69.49 128 96 128z" /></svg>
                          <div className='group-hover:block hidden absolute -top-[140px] w-80 text-sm -right-[153px]   rounded-lg pb-6'>
                            <div className=' bg-black px-3 py-2  text-white rounded-lg '>

                              <p className='text-justify'>Once locked, your content cannot be edited or removed as it is permanently stored in decentralized file storage, which will be accessible for other clients to view and use.</p>
                              <a className='text-blue-500 cursor-pointer'>  Learn more about freezing metadata here.</a>
                              <div className='relative flex justify-center'>
                                <div className='absolute w-3.5 rotate-45  h-3.5 bg-black'></div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      <p className='text-xs text-gray-700'>Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage.</p>




                    </div>
                  </div>

                  {/* Token ID Number */}

                  <div className='bg-white  py-5 sm:p-6'>
                    {' '}
                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='tokenId'
                        className=' font-bold text-gray-700'
                      >
                        Item / Token ID Number
                      </label>
                      <input
                        type='number'
                        id='tokenId'
                        placeholder='Token ID, 1 - max supply'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        {...register('tokenId', {
                          required: {
                            value: true,
                            message: 'Please enter a Token ID',
                          },
                          min: {
                            value: 1,
                            message: 'Token Id must be at least 1',
                          },
                        })}
                      />

                      {errors.tokenId && (
                        <p className='text-sm text-red-500'>
                          {errors.tokenId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Royalty */}
                  <div className='bg-white  py-5 sm:p-6'>
                    {' '}
                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='royalty'
                        className=' font-bold text-gray-700'
                      >
                        Royalty
                      </label>
                      <input
                        type='number'
                        id='royalty'
                        placeholder='Max royalty - 10000, 100 is 1%'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        {...register('royalty', {
                          min: {
                            value: 1,
                            message: 'Royalty must be at least 1',
                          },
                          max: {
                            value: 10000,
                            message:
                              'Royalty must be less than 10000 characters long',
                          },
                        })}
                      />

                      {errors.royalty && (
                        <p className='text-sm text-red-500'>
                          {errors.royalty.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
                    <fieldset>
                      <div className='mt-4 space-y-4'>
                        <div className='flex items-start'>
                          <div className='flex h-5 items-center'>
                            <input
                              id='explicit'
                              type='checkbox'
                              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                              {...register('explicit')}
                            />
                          </div>
                          <div className='ml-3 text-sm'>
                            <label
                              htmlFor='explicit'
                              className='font-medium text-gray-700'
                            >
                              Is explicit or sexual content
                            </label>
                            {/* <p className='text-gray-500'>
                          Get notified when someones posts a comment on a
                          posting.
                        </p> */}
                          </div>
                        </div>

                        {/* <div className='flex items-start'>
                      <div className='flex h-5 items-center'>
                        <input
                          id='freeze'
                          name='freeze'
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                        />
                      </div>

                      <div className='ml-3 text-sm'>
                        <label
                          htmlFor='freeze'
                          className='font-medium text-gray-700'
                        >
                          Freeze Metadata
                        </label>
                        <p className='text-gray-500'>
                          To freeze metadata, you must create your item first
                        </p>
                      </div>
                    </div> */}
                      </div>
                    </fieldset>
                  </div>

                  <div className='bg-gray-50 px-4 py-3 sm:text-left text-center sm:px-6'>
                    <button
                      type='submit'
                      className='w-36 inline-flex justify-center rounded-md border border-transparent bg-thc-primary hover:bg-thc-secondary py-3 px-4 text-lg font-medium text-white shadow-sm  focus:outline-none focus:ring-2'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default CreateItem;


// this is a index page


import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineBars, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

import {ViewGridIcon, EyeIcon, ShareIcon, FlagIcon, DotsVerticalIcon , GlobeAltIcon ,TagIcon } from '@heroicons/react/solid' 
import {
  BsFlagFill,
  BsTagsFill
} from 'react-icons/bs';
import {FaFacebook, FaTwitter } from 'react-icons/fa';
import { GrLineChart } from 'react-icons/gr';
import { MdContentCopy, MdSend } from 'react-icons/md';
import Layout from '@/components/layout/Layout';
import Description from '@/components/listing/Description';
import SingleItem from '@/components/listing/SingleItem';

import { IItems } from '@/types';

const CreateListingPage = () => {
  const [openShareDropdown, setOpenShareDropdown] = useState(false);
  const [openThreedotDropdown, setOpenThreedotDropdown] = useState(false);
  const [priceHistoryDropdown, setPriceHistoryDropdown] = useState(false);
  const [openListingDropdown, setOpenListingDropdown] = useState(false);
  const [openOfferDropdown, setOpenOfferDropdown] = useState(false);
  const [openItemsDropdown, setOpenItemsDropdown] = useState(false);
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [openMoreCollectionDropdown, setOpenMoreCollectionDropdown] =
    useState(false);

  const [currentItem, setItem] = useState({} as IItems);
  const router = useRouter();
  const { collection, item } = router.query;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getItems = async () => {
        try {
          //* uncomment when smartcontracts are ready - done
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/items/contracts/${collection}/items/${item}`
          );
          const newitem = await res.json();
          console.log('item', newitem);
          setItem(newitem);
        } catch (err) {
          setItem({} as IItems);
        }
      };
      getItems();
    }
  }, []);

  return (
    <Layout>
      {currentItem && (
        <div className=' py-24'>
          <div className='sticky z-50 flex justify-end  md:top-24'>
            <button className='m mr-10 rounded-lg py-3  px-10 font-bold text-blue-500'>
              Edit
            </button>
            <Link passHref href={`/collections/${collection}/${item}/sell`}>
              <p className='m mr-10 cursor-pointer rounded-xl bg-blue-500 py-5 px-16 font-bold text-white'>
                Sell
              </p>
            </Link>
          </div>
          <div className='p-6'>
            <div className='flex justify-between '>
              {/* Left side */}

              <div className='hidden w-3/5 px-4 md:block'>
                <div className='hidden md:block'>
                  {' '}
                  <SingleItem
                    ipfs_image={`https://ipfs.io/ipfs/${currentItem?.media?.ipfs}`}
                  ></SingleItem>
                </div>
                <div className='hidden md:block'>
                  {' '}
                  <Description></Description>
                </div>
              </div>

              {/* Right side */}
              <div className='px-4  md:w-4/5'>
                <div className='mt-8 flex justify-between'>
                  <Link href={`/collections/${collection}`} passHref>
                    <span className='cursor-pointer text-blue-500'>
                      {currentItem?.collective?.name}
                    </span>
                  </Link>

                  <div className='flex items-center justify-end'>
                    <div className='group relative'>

                    <svg width='18px' className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.32-27.06-27.2c0-6.634 2.461-13.4 7.96-18.9l45.12-45.14c-28.22-23.14-63.85-36.64-101.3-36.64c-88.09 0-159.8 71.69-159.8 159.8S167.8 415.9 255.9 415.9c73.14 0 89.44-38.31 115.1-38.31c18.48 0 31.97 15.04 31.97 31.96c0 35.04-81.59 70.41-147 70.41c-123.4 0-223.9-100.5-223.9-223.9S132.6 32.44 256 32.44c54.6 0 106.2 20.39 146.4 55.26l47.6-47.63C455.5 34.57 462.3 32.11 468.9 32.11z"/></svg>
                     

                      <div className='absolute -top-16 -right-14 hidden w-44 pb-6 text-center group-hover:block'>
                        <div className=' rounded-lg  bg-black px-4 py-3 text-justify text-sm font-bold text-white'>
                          <span>Refresh Metadata</span>
                          <div className='relative flex justify-center'>
                            <div className='absolute h-4 w-4  rotate-45 bg-black'></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='group relative'>

                    <svg width='18px' className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"/></svg>
                   

                      <div className='absolute -top-16 -right-8 hidden w-32 pb-6 text-center group-hover:block'>
                        <div className=' rounded-lg  bg-black px-4 py-3 text-center text-sm font-bold text-white'>
                          <span>Transfer</span>
                          <div className='relative flex justify-center'>
                            <div className='absolute h-4 w-4  rotate-45 bg-black'></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='group relative'>

                    <svg width='18px' className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32 415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5 38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 480H64C28.65 480 0 451.3 0 416V128z"/></svg>

                   

                      <div className='absolute -top-16 -right-14 hidden w-44 pb-6 text-center group-hover:block'>
                        <div className=' rounded-lg  bg-black px-4 py-3 text-center text-sm font-bold text-white'>
                          <span>View on khsoft team</span>
                          <div className='relative flex justify-center'>
                            <div className='absolute h-4 w-4  rotate-45 bg-black'></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='relative mr-5'>
                      <div
                        onClick={() => {
                          setOpenShareDropdown(!openShareDropdown);
                          setOpenThreedotDropdown(false);
                        }}
                      >
                        <div>
                          <ShareIcon className='w-5'></ShareIcon>
                        </div>
                      </div>
                      <div
                        className={
                          openShareDropdown
                            ? 'absolute -left-44 block w-56 bg-white p-3 '
                            : 'hidden'
                        }
                      >
                        <ul>
                          <Link href='#' passHref>
                            <div className='flex items-center py-2'>
                              <MdContentCopy className='text-2xl  text-blue-600'></MdContentCopy>
                              <li className='ml-3 text-sm'>Copy Link</li>
                            </div>
                          </Link>
                          <Link href='#' passHref>
                            <div className='flex items-center py-2'>
                              <FaFacebook className='text-2xl text-blue-600'></FaFacebook>
                              <li className='ml-3 text-sm'>
                                Share on Facebook
                              </li>
                            </div>
                          </Link>
                          <Link href='#' passHref>
                            <div className='flex items-center py-2'>
                              <FaTwitter className='text-2xl text-blue-600'></FaTwitter>
                              <li className='ml-3 text-sm'>Share on twitter</li>
                            </div>
                          </Link>
                          <Link href='#' passHref>
                            <div className='flex items-center py-2'>
                              <div className='flex items-center'>
                                <AiOutlineLeft className=''></AiOutlineLeft>
                                <AiOutlineRight className='-ml-1'></AiOutlineRight>
                              </div>
                              <li className='ml-2 text-sm'>Embedded items</li>
                            </div>
                          </Link>
                        </ul>
                      </div>
                    </div>

                    <div className='relative'>
                      <div
                        onClick={() => {
                          setOpenThreedotDropdown(!openThreedotDropdown);
                          setOpenShareDropdown(false);
                        }}
                      >
                        <div>
                          <DotsVerticalIcon className='w-5' />
                        </div>
                      </div>
                      <div
                        className={
                          openThreedotDropdown
                            ? 'absolute -left-48 block w-56 bg-white p-3'
                            : 'hidden'
                        }
                      >
                        <ul>
                          <Link href='#' passHref>
                            <div className='flex items-center py-2'>
                              <BsFlagFill className='text-xl'></BsFlagFill>
                              <li className='ml-3'>Report</li>
                            </div>
                          </Link>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className='mt-8'>{currentItem.name}</h1>
                <div className='block md:hidden'>
                  {' '}
                  <SingleItem
                    ipfs_image={`https://ipfs.io/ipfs/${currentItem?.media?.ipfs}`}
                  ></SingleItem>
                </div>
                <div className='mt-10 flex items-center'>
                  <p className='mr-10'>
                    5 owned by <span className='text-blue-500'>you</span>
                  </p>

                  <div className='flex items-center'>
                    <EyeIcon className='w-5 mr-3'></EyeIcon>
                    <p>8 views</p>
                  </div>
                </div>

                {/* price history dropdown */}
                <div className='mt-10'>
                  <div
                    onClick={() =>
                      setPriceHistoryDropdown(!priceHistoryDropdown)
                    }
                    className='flex items-center justify-between py-3 font-bold '
                  >
                    <div>
                      <div className='flex items-center'>
                        <GrLineChart className='mr-4 text-xl font-bold'></GrLineChart>
                        <p className='font-bold'>Price history</p>
                      </div>
                    </div>
                    <div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className={
                          priceHistoryDropdown
                            ? 'h-4 w-4 rotate-0'
                            : 'h-4 w-4 rotate-180'
                        }
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='3'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M5 15l7-7 7 7'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={priceHistoryDropdown ? 'block' : 'hidden'}>
                    <div>
                      <select
                        className='w-1/2'
                        name='cars'
                        id='cars'
                        form='carform'
                      >
                        <option value='7'>Last 7 days</option>
                        <option value='14'>Last 14 days</option>
                        <option value='30'>Last 30 days</option>
                        <option value='60'>Last 60 days</option>
                        <option value='90'>Last 90 days</option>
                        <option value='year'>Last Year</option>
                        <option value='All'>All time</option>
                      </select>
                    </div>

                    <div className='w-24'>
                      <Image
                        src='/images/no-chart-data.svg'
                        height='100'
                        width='100'
                        alt='image'
                      ></Image>
                      <p>No Item Activity Yet</p>
                    </div>
                  </div>
                </div>

                {/* Listing history dropdown */}

                <div className='mt-10'>
                  <div
                    onClick={() => setOpenListingDropdown(!openListingDropdown)}
                    className='flex items-center justify-between py-3 font-bold '
                  >
                    <div>
                      <div className='flex items-center'>
                        <TagIcon className='mr-4 w-5'></TagIcon>
                        <p className='font-bold'>Listing</p>
                      </div>
                    </div>
                    <div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className={
                          openListingDropdown
                            ? 'h-4 w-4 rotate-0'
                            : 'h-4 w-4 rotate-180'
                        }
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='3'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M5 15l7-7 7 7'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={openListingDropdown ? 'block' : 'hidden'}>
                    <div className='flex h-24 items-center justify-center'>
                      <p>No listings yet</p>
                    </div>
                  </div>
                </div>

                {/* offer dropdown  */}

                <div className='mt-10'>
                  <div
                    onClick={() => setOpenOfferDropdown(!openOfferDropdown)}
                    className='flex items-center justify-between py-3 font-bold '
                  >
                    <div>
                      <div className='flex items-center'>
                      <svg width='16px' className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>
                    
                        <p className='font-bold'>Offers</p>
                      </div>
                    </div>
                    <div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className={
                          openOfferDropdown
                            ? 'h-4 w-4 rotate-0'
                            : 'h-4 w-4 rotate-180'
                        }
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='3'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M5 15l7-7 7 7'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={openOfferDropdown ? 'block' : 'hidden'}>
                    <div className='flex h-24 items-center justify-center'>
                      <p>No listings yet</p>
                    </div>
                  </div>
                </div>
                <div className='block md:hidden'>
                  {' '}
                  <Description></Description>
                </div>
              </div>
            </div>

            {/* items dropdown */}

            <div className='mt-10 px-4'>
              <div
                onClick={() => setOpenItemsDropdown(!openItemsDropdown)}
                className='flex items-center justify-between py-3 font-bold '
              >
                <div>
                  <div className='flex items-center'>
                  <svg width='16px' className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 176h370.8l-57.38 57.38c-12.5 12.5-12.5 32.75 0 45.25C351.6 284.9 359.8 288 368 288s16.38-3.125 22.62-9.375l112-112c12.5-12.5 12.5-32.75 0-45.25l-112-112c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L402.8 112H32c-17.69 0-32 14.31-32 32S14.31 176 32 176zM480 336H109.3l57.38-57.38c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-112 112c-12.5 12.5-12.5 32.75 0 45.25l112 112C127.6 508.9 135.8 512 144 512s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L109.3 400H480c17.69 0 32-14.31 32-32S497.7 336 480 336z"/></svg>
                    <p>Item Activity</p>
                  </div>
                </div>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={
                      openItemsDropdown
                        ? 'h-4 w-4 rotate-0'
                        : 'h-4 w-4 rotate-180'
                    }
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='3'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 15l7-7 7 7'
                    />
                  </svg>
                </div>
              </div>
              <div
                className={
                  openItemsDropdown ? 'block h-32 overflow-y-scroll' : 'hidden'
                }
              >
                {/* filter dropdown */}

                <div className='mt-2 px-10'>
                  <div
                    onClick={() => setOpenFilterDropdown(!openFilterDropdown)}
                    className='flex items-center justify-between py-3 font-bold '
                  >
                    <div>
                      <p>Filter</p>
                    </div>
                    <div>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className={
                          openFilterDropdown
                            ? 'h-4 w-4 rotate-0'
                            : 'h-4 w-4 rotate-180'
                        }
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='3'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M5 15l7-7 7 7'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={openFilterDropdown ? 'block  ' : 'hidden'}>
                    <div className='ml-8 '>
                      <div className='flex items-center'>
                        {' '}
                        <input className='mr-4' type='checkbox' /> <p>Sales</p>{' '}
                      </div>
                      <div className='flex items-center'>
                        {' '}
                        <input className='mr-4' type='checkbox' />{' '}
                        <p>Listing</p>{' '}
                      </div>
                      <div className='flex items-center'>
                        {' '}
                        <input className='mr-4' type='checkbox' /> <p>Offer</p>{' '}
                      </div>
                      <div className='flex items-center'>
                        {' '}
                        <input className='mr-4' type='checkbox' />{' '}
                        <p>Collection Offer</p>{' '}
                      </div>
                      <div className='flex items-center'>
                        {' '}
                        <input className='mr-4' type='checkbox' />{' '}
                        <p>Transfer</p>{' '}
                      </div>
                    </div>
                  </div>
                </div>

                {/* another div */}
                <div className='mt-4 flex justify-between px-4'>
                  <p className='w-24'>Event</p>
                  <p className='w-24'>Price</p>
                  <p className='w-24'>Form</p>
                  <p className='w-24'>To</p>
                  <p className='w-24'>Date</p>
                </div>

                <div className='mt-4 flex justify-between px-4'>
                  <p className='w-24'>Minted</p>
                  <p className='w-24'>--</p>
                  <p className='w-24 text-blue-500'>NullAddress</p>
                  <p className='w-24 text-blue-500'>You</p>
                  <p className='w-24'>5 Days ago</p>
                </div>
              </div>
            </div>

            {/* More on collection */}

            <div className='mt-10 px-4'>
              <div
                onClick={() =>
                  setOpenMoreCollectionDropdown(!openMoreCollectionDropdown)
                }
                className='flex items-center justify-between py-3 font-bold '
              >
                <div>
                  <div className='flex items-center'>
                    <ViewGridIcon className='mr-4 w-5'></ViewGridIcon>
                    <p>More From This Collections</p>
                  </div>
                </div>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={
                      openMoreCollectionDropdown
                        ? 'h-4 w-4 rotate-0'
                        : 'h-4 w-4 rotate-180'
                    }
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='3'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 15l7-7 7 7'
                    />
                  </svg>
                </div>
              </div>
              <div className={openMoreCollectionDropdown ? 'block' : 'hidden'}>
                <div className='mt-10  ml-10 mb-36 flex flex-wrap'>
                  <div className='mr-6'>
                    <Image
                      className='transition-all duration-700  hover:scale-110'
                      src={`https://ipfs.io/ipfs/${currentItem?.media?.ipfs}`}
                      width={250}
                      height={250}
                      alt='nft'
                    ></Image>
                    <p>Image</p>
                  </div>

                  <div>
                    <Image
                      className='transition-all duration-700  hover:scale-110'
                      src='/images/homepage-banner.png'
                      width={250}
                      height={250}
                      alt='nft'
                    ></Image>
                    <p>Image</p>
                  </div>
                </div>

                <Link href='/singleCollection/singleCollection'>
                  <p className='text-center font-bold text-blue-500'>
                    View Collection
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateListingPage;


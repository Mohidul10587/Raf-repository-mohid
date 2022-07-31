import React from 'react';
import { FiSearch } from 'react-icons/fi';

export const SearchInput = () => {
  return (
    <div className='p flex flex-1 items-center rounded-xl border-1 px-2 py-1'>
      <p className='text-gray-700'>
        <FiSearch size={18} />
      </p>
      <input
        type='text'
        className='ml-3 flex-1 min-w-[100px] border-transparent p-0 text-lg focus:border-transparent focus:ring-0'
        placeholder='Search...'
      />
    </div>
  );
};

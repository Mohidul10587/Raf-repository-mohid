import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Menu from '@components/header/Menu';

const AuthLayout = ({ children }: any) => {
  const router = useRouter();

  return (
    <>
      <Menu />

      <main>{children}</main>
    </>
  );
};

export default AuthLayout;

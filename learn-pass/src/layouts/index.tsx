import React, { useEffect } from 'react';
import { IRouteComponentProps } from 'umi';

import Footer from '@/components/Footer';
import { getUerInfo } from '@/util';

const UN_LOGIN_PAGE_PATHLIST = ['/login', '/register'];

export default ({ children, location, history }: IRouteComponentProps) => {
  const isLogin = getUerInfo().isLogin;
  const path = location.pathname;

  useEffect(() => {
    if (!isLogin && !UN_LOGIN_PAGE_PATHLIST.includes(path.toLowerCase())) {
      history.push('/login');
    }
    location.pathname === '/' && history.replace('/home');
  }, [location.pathname]);

  return (
    <>
      {children}
      {!UN_LOGIN_PAGE_PATHLIST.includes(path.toLowerCase()) && <Footer />}
    </>
  );
};

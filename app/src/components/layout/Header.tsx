'use client'

import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';
import LogoutButton from '@/components/LogoutButton';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    setIsLoggedIn(!!token && router.pathname !== '/login');
  }, [router.pathname]);

  return (
    <Box as="header" borderBottomWidth="1px" p={4}>
      <Flex align="center">
        <Heading as="h1" size="lg">Stone & Sod CRM</Heading>
        <Spacer />
        {isLoggedIn && <LogoutButton />}
      </Flex>
    </Box>
  );
};

export default Header;

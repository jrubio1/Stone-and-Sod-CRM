'use client'

import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // In a real application, this would send a request to your backend's logout endpoint
    // and clear any local authentication tokens/sessions.
    console.log('Logging out...');
    Cookies.remove('auth_token'); // Clear the authentication token
    router.push('/login'); // Redirect to login page
  };

  return (
    <Button onClick={handleLogout} colorScheme="red">
      Logout
    </Button>
  );
};

export default LogoutButton;

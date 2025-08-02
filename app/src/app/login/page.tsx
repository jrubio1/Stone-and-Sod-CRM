'use client'

import { Box, Heading, Input, Button, FormControl, FormLabel, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, you would send a request to your backend API for authentication
    // For now, we'll simulate a successful login by setting a dummy cookie.
    console.log('Attempting to log in with:', { email, password });

    // Simulate successful login
    Cookies.set('auth_token', 'dummy_jwt_token', { expires: 7 }); // Expires in 7 days

    toast({
      title: 'Login Successful',
      description: `Welcome, ${email}! Redirecting...`,
      status: 'success',
      duration: 1500,
      isClosable: true,
    });

    router.push('/'); // Redirect to dashboard
  };

  return (
    <Box p={8} maxWidth="md" mx="auto" mt={10} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FormControl>
          <Button type="submit" colorScheme="blue" size="lg" width="full">
            Sign In
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

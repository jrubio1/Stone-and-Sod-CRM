'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Text, useToast, Flex } from '@chakra-ui/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      toast({
        title: 'Login Failed',
        description: result.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      router.push('/')
    }
  }

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading>Login</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl mt={6} isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button width="full" mt={4} type="submit" colorScheme="green">
              Sign In
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  )
}

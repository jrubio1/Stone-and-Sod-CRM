'use client'

import { Box, Heading, Spinner, Center } from '@chakra-ui/react'

export default function Page() {
  // In a real application, you would fetch user data from your backend here
  const user = { email: "guest@example.com" }; // Placeholder user

  if (!user) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Box p={8}>
      <Heading as="h1" size="xl">Dashboard</Heading>
      <p>Welcome to LawnCRM, {user.email}!</p>
    </Box>
  )
}
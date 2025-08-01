'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Box, Heading, Spinner, Center } from '@chakra-ui/react'

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading

    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (!session) {
    return null // Will be redirected by useEffect
  }

  return (
    <Box p={8}>
      <Heading as="h1" size="xl">Dashboard</Heading>
      <p>Welcome to LawnCRM, {session.user?.email}!</p>
    </Box>
  )
}

'use client'

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { Box, Flex, ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ChakraProvider theme={theme}>
            <Flex direction="column" minH="100vh">
              <Header />
              <Flex flex="1">
                <Sidebar />
                <Box as="main" flex="1" p={4}>
                  {children}
                </Box>
              </Flex>
              <Footer />
            </Flex>
          </ChakraProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

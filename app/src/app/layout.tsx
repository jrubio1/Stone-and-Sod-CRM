'use client'

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { Box, Flex } from '@chakra-ui/react';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  )
}
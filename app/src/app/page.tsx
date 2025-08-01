'use client'

import { Box, Flex } from '@chakra-ui/react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

export default function Page() {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex flex="1">
        <Sidebar />
        <Box as="main" flex="1" p={4}>
          {/* Your page content goes here */}
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}

'use client'

import { Box, VStack, Link } from '@chakra-ui/react';

const Sidebar = () => {
  return (
    <Box as="aside" w="250px" borderRightWidth="1px" p={4}>
      <VStack as="nav" spacing={4} align="stretch">
        <Link href="#">Dashboard</Link>
        <Link href="/customer">Customers</Link>
        <Link href="#">Projects</Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;

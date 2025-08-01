'use client'

import { Box, Heading } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box as="header" borderBottomWidth="1px" p={4}>
      <Heading as="h1" size="lg">My Application</Heading>
    </Box>
  );
};

export default Header;

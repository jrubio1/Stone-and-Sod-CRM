'use client'

import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" borderTopWidth="1px" p={4} textAlign="center">
      <Text fontSize="sm" color="gray.500">
        © {new Date().getFullYear()} My Application
      </Text>
    </Box>
  );
};

export default Footer;

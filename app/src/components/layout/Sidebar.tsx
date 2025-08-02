import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { FaHome, FaUsers, FaClipboardList, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  // In the new architecture, authentication state will be managed differently.
  // For now, we'll assume the sidebar is always visible.
  return (
    <Box
      as="nav"
      w="200px"
      bg="gray.800"
      color="white"
      p={4}
      display={{ base: 'none', md: 'block' }}
    >
      <Flex direction="column" align="flex-start">
        <Link href="/" py={2} w="full">
          <Flex align="center">
            <FaHome />
            <Text ml={2}>Dashboard</Text>
          </Flex>
        </Link>
        <Link href="/customer" py={2} w="full">
          <Flex align="center">
            <FaUsers />
            <Text ml={2}>Customers</Text>
          </Flex>
        </Link>
        <Link href="/work-requests" py={2} w="full">
          <Flex align="center">
            <FaClipboardList />
            <Text ml={2}>Work Requests</Text>
          </Flex>
        </Link>
        <Link href="/settings" py={2} w="full">
          <Flex align="center">
            <FaCog />
            <Text ml={2}>Settings</Text>
          </Flex>
        </Link>
      </Flex>
    </Box>
  );
};

export default Sidebar;
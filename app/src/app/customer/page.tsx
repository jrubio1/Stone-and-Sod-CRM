'use client'

import { Box, Button, Flex, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Spinner, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Customers</Heading>
        <Button colorScheme="green">Create Customer</Button>
      </Flex>
      <Tabs>
        <TabList>
          <Tab>Customers</Tab>
          <Tab>Properties</Tab>
          <Tab>Work Requests</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>Tags</Th>
                  <Th>Source</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* Placeholder Data */}
                <Tr>
                  <Td>John Doe</Td>
                  <Td>Active</Td>
                  <Td>Residential</Td>
                  <Td>Website</Td>
                  <Td>
                    <Button size="sm" mr={2}>Edit</Button>
                    <Button size="sm" colorScheme="red">Delete</Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Jane Smith</Td>
                  <Td>Lead</Td>
                  <Td>Commercial</Td>
                  <Td>Referral</Td>
                  <Td>
                    <Button size="sm" mr={2}>Edit</Button>
                    <Button size="sm" colorScheme="red">Delete</Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>
          <TabPanel>
            <p>Properties placeholder</p>
          </TabPanel>
          <TabPanel>
            <p>Work Requests placeholder</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

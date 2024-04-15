import Head from 'next/head'
import { Container } from '@chakra-ui/layout'
import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getStores } from '../../api'
import { Store } from '../../types'
import { isValidAdminToken } from '../../utils/check-admin-token'
import { useRouter } from 'next/router'

type Props = {
  stores: Store[]
}

const Redirect404 = {
  redirect: {
    destination: '/404',
    permanent: false,
  },
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  if (!isValidAdminToken(ctx)) {
    return Redirect404
  }
  const stores = await getStores()
  return { props: { stores } }
}

export default function Admin({ stores }: Props) {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Container marginTop={10}>
        <VStack spacing={3} align={'flex-start'}>
          <Heading>Stores</Heading>
          <TableContainer width={'100%'}>
            <Table size={'sm'}>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th align="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stores.map((store) => (
                  <Tr key={store.id}>
                    <Td>{store.name}</Td>
                    <Td align="right">
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/${store.id}?token=${router.query.token}`)
                        }
                      >
                        Edit
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Container>
    </>
  )
}

import Head from 'next/head'
import Image from 'next/image'
import { Container } from '@chakra-ui/layout'
import {
  Button,
  HStack,
  Heading,
  VStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getStore, getStoreProducts } from '../../api'
import { Product, Store } from '../../types'
import { isValidAdminToken } from '../../utils/check-admin-token'
import { CreateProductModal } from '../../components/create-product-modal'
import { useState } from 'react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useQuery } from 'react-query'
import { DeleteProductModal } from '../../components/delete-product-modal'

type Props = {
  store: Store
  products: Product[]
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
  const id = ctx.query.storeId as string
  const [store, products] = await Promise.all([getStore(id), getStoreProducts(id)])
  return { props: { store, products } }
}
export default function Admin({ store, products }: Props) {
  const { data } = useQuery({
    initialData: products,
    queryKey: ['stores', store.id, 'products'],
    queryFn: () => getStoreProducts(store.id),
  })
  const [openCreateProduct, setOpenCreateProduct] = useState(false)
  const [openDeleteProduct, setOpenDeleteProduct] = useState<Product | null>(null)

  return (
    <>
      <Head>
        <title>`Admin Store {store.name}`</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Container marginTop={10}>
        <VStack spacing={2} align={'flex-start'} pb={10}>
          <Heading mb={4}>{store.name}</Heading>
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th>Order</Th>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th align="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((product, i) => (
                <Tr key={product.id}>
                  <Td>#{i + 1}</Td>
                  <Td>
                    <Image
                      src={product.imageUrl ?? 'https://via.placeholder.com/150'}
                      width={50}
                      height={50}
                      quality={100}
                      priority={true}
                      alt={`Picture of ${product.name}`}
                      style={{
                        borderRadius: '4px',
                        width: 'auto',
                        height: 'auto',
                      }}
                    />
                  </Td>
                  <Td>{product.name}</Td>
                  <Td>{product.category}</Td>
                  <Td align="right">
                    <IconButton
                      aria-label="Search database"
                      icon={<DeleteIcon />}
                      onClick={() => setOpenDeleteProduct(product)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <HStack>
            <Button onClick={() => setOpenCreateProduct(true)}>New Product</Button>
          </HStack>
        </VStack>
      </Container>
      {openDeleteProduct && (
        <DeleteProductModal
          open={!!openDeleteProduct}
          onClose={() => setOpenDeleteProduct(null)}
          store={store}
          product={openDeleteProduct}
        />
      )}
      <CreateProductModal
        open={openCreateProduct}
        onClose={() => setOpenCreateProduct(false)}
        storeId={store.id}
      />
    </>
  )
}

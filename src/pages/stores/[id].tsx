import Head from 'next/head'
import { getStore, getStoreProducts } from '../../api'
import { GetServerSideProps } from 'next'
import { Product, Store } from '../../types'
import { formatPrice } from '../../utils/numbers'
import {
  Badge,
  Button,
  Card,
  Container,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  useNumberInput,
} from '@chakra-ui/react'
import { partitionBy } from '../../utils/collections'
import Image from 'next/image'
import React, { createRef, useEffect, useMemo, useState } from 'react'
import { ProductModal } from '../../components/product-modal'

type Props = {
  store: Store
  products: Product[]
}

const CountInput = () => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 99,
    precision: 0,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <HStack>
      <Button {...inc}>+</Button>
      <Input {...input} />
      <Button {...dec}>-</Button>
    </HStack>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const storeId = ctx.query.id as string
  const store = await getStore(storeId)
  const products = await getStoreProducts(storeId)

  return {
    props: {
      store,
      products,
    },
  }
}

export default function StorePage({ store, products }: Props) {
  const groups = partitionBy(products, (p) => p.category)
  const categories = groups.map((g) => g.key)
  const [focus, setFocus] = useState<string | null>(categories.length > 0 ? categories[0] : null)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)

  const categorySectionRefs = useMemo(() => {
    const entries = categories.map((cat) => [cat, createRef<HTMLDivElement>()] as const)
    return new Map(entries)
  }, [categories])

  useEffect(() => {
    const onEvent = () => {
      for (const category of categories) {
        const ref = categorySectionRefs.get(category)
        const rect = ref?.current?.getBoundingClientRect()
        const isInside = rect ? rect.top >= 0 && rect.top <= window.innerHeight : false

        if (isInside) {
          setFocus(category)
          return
        }
      }
    }
    document.addEventListener('scroll', onEvent)
    return () => document.removeEventListener('scroll', onEvent)
  }, [categorySectionRefs, categories])

  return (
    <>
      <Head>
        <title>{store.name} </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
        <Stack margin={0} padding={2}>
          <Text fontWeight={'bold'} variant="subtitle1">
            {store.name}
          </Text>
        </Stack>
        <HStack
          align={'center'}
          bgColor={'#fafafa'}
          top={0}
          position={'sticky'}
          zIndex={10}
          py={2}
          overflowX={'scroll'}
          style={{ scrollbarWidth: 'none' }}
          borderBottom={'1px solid #e0e0e0'}
        >
          {categories.map((category, index) => (
            <Badge
              padding={1}
              colorScheme="green"
              ml={index === 0 ? 2 : 0}
              mr={index === categories.length - 1 ? 2 : 0}
              variant={focus === category ? 'solid' : 'subtle'}
              borderRadius={'md'}
              key={category}
              onClick={() => {
                const ref = categorySectionRefs.get(category)
                ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
            >
              {category}
            </Badge>
          ))}
        </HStack>
        <Container>
          <Stack my={4} spacing={4}>
            {groups.map((group) => (
              <Stack ref={categorySectionRefs.get(group.key)} id={group.key} key={group.key}>
                <Stack
                  style={{ position: 'sticky', top: 0, backgroundColor: '#fafafa', zIndex: 1 }}
                  margin={0}
                >
                  <Text fontWeight={'bold'} variant="subtitle2">
                    {group.key}
                  </Text>
                </Stack>
                {group.items.map((product) => (
                  <Card
                    key={product.id}
                    cursor={'pointer'}
                    onClick={() => setModalProduct(product)}
                  >
                    <HStack p={2} alignItems={'flex-start'}>
                      <VStack
                        h={'100px'}
                        w={'100px'}
                        flexShrink={0}
                        borderRadius={'md'}
                        overflow={'hidden'}
                      >
                        <Image
                          quality={50}
                          src={'https://via.placeholder.com/150'}
                          width={100}
                          height={100}
                          alt={`Picture of ${product.name}`}
                        />
                      </VStack>
                      <Stack margin={0} padding={2}>
                        <Stack spacing={1}>
                          <Text fontWeight={'bold'}>{product.name}</Text>
                          <Text fontSize="sm" color={'gray.500'} noOfLines={1}>
                            {product.description}
                          </Text>
                        </Stack>
                        <Text>{formatPrice(product.price)}</Text>
                      </Stack>
                    </HStack>
                  </Card>
                ))}
              </Stack>
            ))}
          </Stack>
        </Container>
        {/* TODO: enable when cart is implemented */}
        {/* <Card width={'100%'} position={'fixed'} bottom={0}>
          <HStack p={2}>
            <Text>Footer</Text>
          </HStack>
        </Card> */}
      </main>
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </>
  )
}

import Head from 'next/head'
import { getStore, getStoreProducts } from '../../api'
import { GetServerSideProps } from 'next'
import { Product, Store } from '../../types'
import { Badge, Container, HStack, Stack, Text } from '@chakra-ui/react'
import { partitionBy } from '../../utils/collections'
import React, { createRef, useEffect, useMemo, useState } from 'react'
import { ProductModal } from '../../components/product-modal'
import { ProductCard } from '../../components/product-card'

type Props = {
  store: Store
  products: Product[]
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
              cursor={'pointer'}
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
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setModalProduct(product)}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        </Container>
      </main>
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </>
  )
}

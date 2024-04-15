import { Card, HStack, VStack, Stack, Text } from '@chakra-ui/react'
import { formatPrice } from '../utils/numbers'
import Image from 'next/image'
import { Product } from '../types'

type Props = {
  product: Product
  onClick: () => void
}

export const ProductCard = ({ product, onClick }: Props) => {
  return (
    <Card cursor={'pointer'} onClick={() => onClick()}>
      <HStack p={2} alignItems={'flex-start'}>
        <VStack h={'100px'} w={'100px'} flexShrink={0} borderRadius={'md'} overflow={'hidden'}>
          <Image
            quality={50}
            src={product.imageUrl ?? 'https://via.placeholder.com/150'}
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
  )
}

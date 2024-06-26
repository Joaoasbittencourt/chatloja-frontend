import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { formatPrice } from '../utils/numbers'
import { Product } from '../types'
import Image from 'next/image'

type Props = {
  product: Product | null
  onClose: () => void
}

export const ProductModal = ({ onClose, product }: Props) => {
  return (
    <Modal
      motionPreset="slideInBottom"
      onClose={() => onClose()}
      size={['full', 'md']}
      isOpen={!!product}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product?.name}</ModalHeader>
        <ModalCloseButton justifySelf={'center'} alignSelf={'center'} />
        <Stack width={'100%'}>
          <Image
            src={product?.imageUrl ?? 'https://via.placeholder.com/150'}
            width={150}
            height={150}
            quality={100}
            priority={true}
            alt="Picture of the author"
            style={{
              width: '100%',
            }}
          />
        </Stack>
        <Stack mb={20} p={4} spacing={4}>
          <Text color={'gray.700'}>{product?.description}</Text>
          <Text fontWeight={'bold'} color={'gray.700'}>
            {product?.price ? formatPrice(product.price) : null}
          </Text>
        </Stack>
      </ModalContent>
    </Modal>
  )
}

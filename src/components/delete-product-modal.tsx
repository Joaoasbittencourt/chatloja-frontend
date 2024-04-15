import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  Button,
  HStack,
  useToast,
  Stack,
} from '@chakra-ui/react'
import { Product, Store } from '../types'
import { useMutation, useQueryClient } from 'react-query'
import { deleteStoreProduct } from '../api'

type Props = {
  store: Store
  product: Product
  onClose: () => void
  open: boolean
}

export const DeleteProductModal = ({ onClose, open, store, product }: Props) => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(
    (req: { storeId: string; productId: string }) => deleteStoreProduct(req.storeId, req.productId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['stores', store.id, 'products'])
        toast({
          title: `Product ${product.name} from store ${store.name} deleted successfully!`,
        })
        onClose()
      },
      onError: (err: Error) => {
        toast({ title: err?.message ?? 'Error', status: 'error' })
      },
    },
  )

  return (
    <Modal
      motionPreset="slideInBottom"
      onClose={() => onClose()}
      size={['full', 'md']}
      isOpen={open}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Product</ModalHeader>
        <Stack p={4}>
          <Text>{`Are you sure you want to delete ${product.name} from store ${store.name}?`}</Text>
        </Stack>
        <ModalCloseButton justifySelf={'center'} alignSelf={'center'} />
        <HStack p={4}>
          <Button
            mr={3}
            colorScheme="red"
            isLoading={isLoading}
            onClick={() =>
              mutate({
                storeId: store.id,
                productId: product.id,
              })
            }
          >
            Delete
          </Button>
          <Button isDisabled={isLoading} variant="ghost" onClick={() => onClose()}>
            Cancel
          </Button>
        </HStack>
      </ModalContent>
    </Modal>
  )
}

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Stack,
  Textarea,
  Input,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react'
import { Product } from '../types'
import { useFormState } from '../hooks/use-form-reducer'
import { useMutation, useQueryClient } from 'react-query'
import { createStoreProduct } from '../api'

type Props = {
  storeId: string
  onClose: () => void
  open: boolean
}

const initialData = {
  name: '',
  category: '',
  description: '',
  price: '10.00',
  imageUrl: null,
}

export const CreateProductModal = ({ onClose, open, storeId }: Props) => {
  const format = (val: string) => `$ ` + val
  const parse = (val: string) => val.replace(/^\$/, '')
  const [value, update] = useFormState(initialData)
  const toast = useToast()
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(
    (req: { storeId: string; product: Omit<Product, 'id'> }) =>
      createStoreProduct(req.storeId, req.product),
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(['stores', storeId, 'products'])
        update(initialData)
        toast({ title: `Product ${res.name} created!` })
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
        <ModalHeader>Create Product</ModalHeader>
        <ModalCloseButton justifySelf={'center'} alignSelf={'center'} />
        <Stack mb={20} p={4} spacing={4}>
          <Input
            placeholder="Name"
            onChange={(e) => update({ name: e.target.value })}
            value={value.name}
          />
          <Input
            onChange={(e) => update({ category: e.target.value })}
            value={value.category}
            placeholder="Category"
          />
          <Textarea
            placeholder="Description"
            onChange={(e) => update({ description: e.target.value })}
            value={value.description}
          />
          <NumberInput
            onChange={(str) => update({ price: parse(str) })}
            value={format(value.price)}
            min={0.01}
            max={999.99}
          >
            <NumberInputField />
          </NumberInput>{' '}
        </Stack>
        <HStack p={4}>
          <Button
            mr={3}
            colorScheme="blue"
            isLoading={isLoading}
            onClick={() =>
              mutate({
                storeId,
                product: { ...value, price: parseInt(value.price) * 100 },
              })
            }
          >
            Save
          </Button>
          <Button isDisabled={isLoading} variant="ghost" onClick={() => onClose()}>
            Cancel
          </Button>
        </HStack>
      </ModalContent>
    </Modal>
  )
}

import { Product, Store } from './types'

const url = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}

export const getStore = async (id: string): Promise<Store> => {
  const res = await fetch(url(`/stores/${id}`))
  return await res.json()
}

export const getStoreProducts = async (id: string): Promise<Product[]> => {
  const res = await fetch(url(`/stores/${id}/products`))
  return await res.json()
}

export const getStores = async (): Promise<Store[]> => {
  const res = await fetch(url('/stores'))
  return await res.json()
}

export const createStoreProduct = async (storeId: string, product: Omit<Product, 'id'>) => {
  const res = await fetch(url(`/stores/${storeId}/products`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })
  return await res.json()
}

export const deleteStoreProduct = async (storeId: string, productId: string) => {
  await fetch(url(`/stores/${storeId}/products/${productId}`), {
    method: 'DELETE',
  })
}

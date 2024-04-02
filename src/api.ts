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

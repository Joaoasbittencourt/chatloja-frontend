import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@fontsource/open-sans'
import { ChakraProvider } from '@chakra-ui/react'
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

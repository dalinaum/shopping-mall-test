import { QueryClient } from 'react-query'
import { RequestDocument, request } from 'graphql-request'

type AnyOBJ = { [key: string]: any }

export const getClient = (() => {
    let client: QueryClient | null = null
    return () => {
        if (!client) client = new QueryClient({
            defaultOptions: {
                queries: {
                    cacheTime: Infinity,
                    staleTime: Infinity,
                    refetchOnMount: false,
                    refetchOnReconnect: false,
                    refetchOnWindowFocus: false
                }
            }
        })
        return client
    }
})()

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8000/graphql'

export const graphqlFetcher = <T>(query: RequestDocument, variables = {}) =>
    request<T>(BASE_URL, query, variables)
// TODO: 강의에서는 Acceess-Control-Allow-Origin을 넣는데 그건 잘못인 것 같고, Origin은 다음에 넣어보자.

export const QueryKeys = {
    PRODUCTS: 'PRODUCTS',
    CART: 'CART',
}
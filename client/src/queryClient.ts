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

console.log("BASE_URL" + import.meta.env.VITE_SERVER_BASE_URL)
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8000/graphql'

export const resetFetcher = async ({
    method,
    path,
    body,
    params,
}: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    body?: AnyOBJ;
    params?: AnyOBJ;
}) => {
    try {
        let url = `${BASE_URL}${path}`
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': BASE_URL
            }
        }
        if (params) {
            const searchParams = new URLSearchParams(params)
            url += '?' + searchParams.toString()
        }
        if (body) {
            fetchOptions.body = JSON.stringify(body)
        }
        const res = await fetch(url, fetchOptions)
        const json = await res.json()
        return json
    } catch (err) {
        console.error(err)
    }
}

export const graphqlFetcher = <T>(query: RequestDocument, variables = {}) =>
    request<T>(BASE_URL, query, variables)

export const QueryKeys = {
    PRODUCTS: 'PRODUCTS',
    CART: 'CART',
}
import { gql } from "graphql-tag"
import { Product } from "./products"

export type CartType = {
    id: string
    amount: number
    product: Product
}

export const GET_CART = gql`
    query GET_CART {
        cart {
            id
            amount
            product {
                id
                imageUrl
                price
                title
                description
                createdAt
            }
        }
    }
`

export const ADD_CART = gql`
    mutation ADD_CART($id: ID!) {
        addCart(productId: $id) {
            id
            amount
            product {
                id
                imageUrl
                price
                title
                description
                createdAt
            }
        }
    }
`

export const UPDATE_CART = gql`
    mutation UPDATE_CART($id: ID!, $amount: Int!) {
        updateCart(cartId: $id, amount: $amount) {
            id
            amount
            product {
                id
                imageUrl
                price
                title
                description
                createdAt
            }
        }
    }
`

export const DELTE_CART = gql`
    mutation DELETE_CART($id: ID!) {
        deleteCart(cartId: $id)
    }
`

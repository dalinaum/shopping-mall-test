import { gql } from "graphql-tag"; 

export const EXECUTE_PAY = gql `
    mutation EXECUTE_PAY($info: [String!]) {
        cart(info: $info) {
            id
            imageUrl
            price
            title
            amount
        }
    }
`
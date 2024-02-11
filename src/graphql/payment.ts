import { gql } from "graphql-tag"; 

export const EXECUTE_PAY = gql `
    type PayInfo {
        id: String!
        amount: Int!
    }
    type PaymentInfos {
        payInfo: [PayInfo]
    }

    mutation EXECUTE_PAY($info: PaymentInfos) {
        cart(info: $info) {
            id
            imageUrl
            price
            title
            amount
        }
    }
`
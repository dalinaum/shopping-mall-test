import { HttpResponse, graphql } from 'msw'
import GET_PRODUCTS, { GET_PRODUCT } from '../graphql/products'
import { ADD_CART, CartType, GET_CART, UPDATE_CART } from '../graphql/cart'

const mock_products = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + '',
    imageUrl: 'https://picsum.photos/200/150',
    price: 50000,
    title: `임시상품${i + 1}`,
    description: `임시상세내용${i + 1}`,
    createdAt: new Date(1705164283682 + (i * 1000 * 60 * 60 * 24)).toString()
}))

let cartData: { [key: string]: CartType } = {}

export const handlers = [
    graphql.query(GET_PRODUCTS, () => {
        return HttpResponse.json({
            data: {
                products: mock_products
            }
        })
    }),

    graphql.query(GET_PRODUCT, ({ variables }) => {
        const { id } = variables
        return HttpResponse.json({
            data: mock_products.find(item => item.id == id)
        })
    }),

    graphql.query(GET_CART, () => {
        return HttpResponse.json({
            data: cartData
        })
    }),

    graphql.mutation(ADD_CART, ({ variables }) => {
        const { id } = variables

        const found = mock_products.find(item => item.id == id)
        if (!found) {
            throw new Error('상품이 없습니다.')
        }
        const newItem = {
            ...found,
            amount: (cartData[id]?.amount || 0) + 1
        }
        const newCartData = {
            ...cartData,
            [id]: newItem
        }
        cartData = newCartData
        return HttpResponse.json({
            data: newItem
        })
    }),

    graphql.mutation(UPDATE_CART, ({ variables }) => {
        const { id, amount } = variables

        if (!cartData[id]) {
            throw new Error('없는 데이터입니다')
        }
        const newItem = {
            ...cartData[id],
            amount
        }
        const newCartData = {
            ...cartData,
            [id]: newItem
        }
        cartData = newCartData
        return HttpResponse.json({
            data: newItem
        })
    })
]
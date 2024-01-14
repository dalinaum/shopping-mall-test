import { HttpResponse, graphql } from 'msw'
import GET_PRODUCTS, { GET_PRODUCT } from '../graphql/products'

const mock_products = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + '',
    imageUrl: 'https://picsum.photos/200/150',
    price: 50000,
    title: `임시상품${i + 1}`,
    description: `임시상세내용${i + 1}`,
    createdAt: new Date(1705164283682 + (i * 1000 * 60 * 60 * 24)).toString()
}))

export const handlers = [
    graphql.query(GET_PRODUCTS, () => {
        return HttpResponse.json({
            data: {
                products: mock_products
            }
        })
    }),
    graphql.query(GET_PRODUCT, () => {
        return HttpResponse.json({
            data: mock_products[0]
        })
    })
]
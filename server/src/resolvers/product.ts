import { DBField, writeDB } from '../dbController'
import { Products, Resolver } from './types'
import { v4 as uuid } from 'uuid'

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data)

const productResolver: Resolver = {
    Query: {
        products: (parent, { cursor = '', showDeleted = false }, { db }) => {
            const filteredDb = showDeleted
                ? db.products
                : db.products.filter(product => !!product.createdAt)
            const fromIndex = filteredDb.findIndex(product => product.id === cursor) + 1
            return filteredDb.slice(fromIndex, fromIndex + 15) || []
        },
        product: (parent, { id }, { db }) => {
            const found = db.products.find(item => item.id === id)
            if (found) return found
            return null
        }
    },
    Mutation: {
        addProduct: (parent, {
            imageUrl,
            price,
            title,
            description
        }, { db }) => {
            const newProduct = {
                id: uuid(),
                imageUrl,
                price,
                title,
                description,
                createdAt: Date.now()
            }
            db.products.push(newProduct)
            setJSON(db.products)
            return newProduct
        },
        updateProduct: (parent, { id, ...data }, { db }) => {
            const existProductIndex = db.products.findIndex(item => item.id === id)
            if (existProductIndex < 0) {
                throw new Error("없는 상품입니다")
            }
            const updatedItem = {
                ...db.products[existProductIndex],
                ...data
            }
            db.products.splice(existProductIndex, 1, updatedItem)
            setJSON(db.products)
            return updatedItem
        },
        deleteProduct: (parent, { id }, { db }) => {
            // 실제 db에서 delete를 하는 대신,
            // createdAt을 지워서 있는 애만 지우는 편법을 쓰자.
            // 파이어베이스에서(?) sort와 filter는 같은 옵션으로만 가능한 제한이 있다.
            const existProductIndex = db.products.findIndex(item => item.id === id)
            if (existProductIndex < 0) {
                throw new Error("없는 상품입니다")
            }
            const updatedItem = {
                ...db.products[existProductIndex]
            }
            delete updatedItem.createdAt
            db.products.splice(existProductIndex, 1, updatedItem)
            setJSON(db.products)
            return id
        }
    }
}

export default productResolver
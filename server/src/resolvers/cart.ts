import { DBField, writeDB } from "../dbController"
import { Cart, Resolver } from "./types"

const setJSON = (data: Cart) => writeDB(DBField.CART, data)

const cartResolver: Resolver = {
    Query: {
        cart: (parent, args, { db }) => {
            return db.cart 
        }
    },
    Mutation: {
        addCart: (parent, { id }, { db }, info) => {
            if (!id) throw Error('상품id가 없다')
            const targetProduct = db.products.find(item => item.id === id)

            if (!targetProduct) {
                throw new Error('상품이 없습니다')
            }

            const existCartItemIndex = db.cart.findIndex(item => item.id === id)
            if (existCartItemIndex > -1) {
                const newCartItem = {
                    id,
                    amount: db.cart[existCartItemIndex].amount + 1
                }
                db.cart.splice(existCartItemIndex, 1, newCartItem)
                setJSON(db.cart)
                return newCartItem
            }

            const newItem = {
                id,
                amount: 1,
                product: targetProduct
            }
            db.cart.push(newItem)
            setJSON(db.cart)
            return newItem
        },
        // updateCart: (parent, { id, amount }, context, info) => {
        //     const newData = { ...cartData }
        //     if (!newData[id]) {
        //         throw new Error('없는 데이터입니다')
        //     }
        //     const newItem = {
        //         ...newData[id],
        //         amount,
        //     }
        //     newData[id] = newItem
        //     cartData = newData
        //     return newItem
        // },
        // deleteCart: (parent, { id }, context, info) => {
        //     const newData = { ...cartData }
        //     delete newData[id]
        //     cartData = newData
        //     return id
        // },
        // executePay: (parent, { ids }, context, info) => {
        //     const newCartData = cartData.filter(cartItem =>
        //         !ids.include(cartItem.id)
        //     )
        //     cartData = newCartData
        //     return ids
        // }
    },
    CartItem: {
        product: (cartItem, args, { db }) => db.products.find((product: any) => product.id === cartItem.id)
    }
}

export default cartResolver
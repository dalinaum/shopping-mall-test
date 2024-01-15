import { SyntheticEvent } from "react"
import { useMutation } from "react-query"
import { UPDATE_CART, CartType } from "../../graphql/cart"
import { QueryKeys, getClient, graphqlFetcher } from "../../queryClient"

const CartItem = ({
    id,
    imageUrl,
    price,
    title,
    amount
}: CartType) => {
    const { mutate: updateCart } = useMutation(({ id, amount }: { id: string, amount: number }) =>
        graphqlFetcher(UPDATE_CART, { id, amount }))

    const handleUpdate = (e: SyntheticEvent) => {
        const amount = Number((e.target as HTMLInputElement).value)
        const queryClient = getClient()
        updateCart({ id, amount }, {
            onSuccess: newValue => {
                console.log(newValue)
                // const prevCart = queryClient.getQueryData<{[key: string]: CartType}>(QueryKeys.CART)
                const newCart = {
                    ...newValue as {[key: string]: CartType}
                }
                queryClient.setQueryData(QueryKeys.CART, newCart)
            }
        })
    }

    return (
        <li className="cart-item">
            <img src={imageUrl} />
            <p className="cart-item__price">{price}</p>
            <p className="cart-item__title">{title}</p>
            <input
                type="number"
                className="cart-item__amount"
                value={amount}
                onChange={handleUpdate}
            />
        </li>
    )
}

export default CartItem

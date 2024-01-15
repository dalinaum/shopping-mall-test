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
        graphqlFetcher(UPDATE_CART, { id, amount }), {

        })

    const handleUpdateAmount = (e: SyntheticEvent) => {
        const amount = Number((e.target as HTMLInputElement).value)
        updateCart({ id, amount }, {
            onSuccess: newValue => {
                getClient().setQueryData(QueryKeys.CART, newValue)
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
                onChange={handleUpdateAmount}
            />
        </li>
    )
}

export default CartItem

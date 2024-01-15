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
    const queryClient = getClient()
    const { mutate: updateCart } = useMutation(
        ({ id, amount }: { id: string, amount: number }) =>
            graphqlFetcher(UPDATE_CART, { id, amount }),
        {
            onMutate: async ({ id, amount }) => {
                await queryClient.cancelQueries(QueryKeys.CART)
                const prevCart = queryClient.getQueryData<{ [key: string]: CartType }>(QueryKeys.CART)
                if (!prevCart?.[id]) return prevCart

                const newCart = {
                    ...(prevCart || {}),
                    [id]: { ...prevCart[id], amount }
                }
                queryClient.setQueryData(QueryKeys.CART, newCart)
            },

            onSuccess: newValue => {
                const prevCart = queryClient.getQueryData<CartType>(QueryKeys.CART)
                const newCart = {
                    ...(prevCart || {}),
                    [id]: newValue
                }
                console.log('onSuccess', newCart)
                getClient().setQueryData(QueryKeys.CART, newCart)
            },
        })

    const handleUpdateAmount = (e: SyntheticEvent) => {
        const amount = Number((e.target as HTMLInputElement).value)
        updateCart({ id, amount })
    }

    return (
        <li className="cart-item">
            <img className="cart-item__image" src={imageUrl} />
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

import { SyntheticEvent } from "react"
import { useMutation } from "react-query"
import { UPDATE_CART, CartType, DELTE_CART } from "../../graphql/cart"
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

    const { mutate: deleteCart } = useMutation(
        ({ id }: { id: string }) => graphqlFetcher(DELTE_CART, { id }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(QueryKeys.CART)
                // CART useQuery를 쓰는 곳이 10곳이면 invalidateQueries는
                // 한 번의 업데이트로 10곳을 갱신할 수 있다.
            }
        }
    )

    const handleUpdateAmount = (e: SyntheticEvent) => {
        const amount = Number((e.target as HTMLInputElement).value)
        if (amount < 1) return
        updateCart({ id, amount })
    }

    const handleDeleteItem = () => {
        deleteCart({ id })
    }

    return (
        <li className="cart-item">
            <input className="cart-item__checkbox" type="checkbox" name="select-item" />
            <img className="cart-item__image" src={imageUrl} />
            <p className="cart-item__price">{price}</p>
            <p className="cart-item__title">{title}</p>
            <input
                className="cart-item__amount"
                type="number"
                value={amount}
                min={1}
                onChange={handleUpdateAmount}
            />
            <button className="cart-item__button" type="button" onClick={handleDeleteItem} >
                삭제
            </button>
        </li>
    )
}

export default CartItem

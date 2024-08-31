import { useQuery } from "react-query"
import { QueryKeys, graphqlFetcher } from "../../queryClient"
import { GET_CART, CartType } from "../../graphql/cart"
import CartList from "../../components/cart/index"

const Cart = () => {
    const { data } = useQuery(QueryKeys.CART, () =>
        graphqlFetcher<{ cart: CartType[] }>(GET_CART), {
        staleTime: 0,
        cacheTime: 1000,
    })
    const cartItems = (data?.cart || [])
    if (!cartItems.length) return <div>장바구니가 비었습니다</div>
    return <CartList items={cartItems} />
}

export default Cart

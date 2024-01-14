import { useQuery } from "react-query"
import { QueryKeys, graphqlFetcher } from "../../queryClient"
import { GET_CART, CartType } from "../../graphql/cart"
import CartList from "../../components/cart/index"

const Cart = () => {
    const { data } = useQuery(QueryKeys.CART, () => graphqlFetcher<{ [key: string]: CartType }>(GET_CART))

    const cartItems = Object.values<CartType>(data || {})

    if (!cartItems.length) return <div>장바구니가 비었습니다</div>

    return <CartList items={cartItems} />
}

export default Cart

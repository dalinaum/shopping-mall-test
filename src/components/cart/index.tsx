import CartItem from "./item"
import { CartType } from "../../graphql/cart"


const CartList = ({ items }: { items: CartType[] }) => {
    return (
        <ul className="cart">
            {items.map(item => (
                <CartItem {...item} key={item.id} />
            ))}
        </ul>
    )
}

export default CartList

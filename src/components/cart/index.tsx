import CartItem from "./item"
import { CartType } from "../../graphql/cart"


const CartList = ({ items }: { items: CartType[] }) => {
    return (
        <>
            <label><input type="checkbox" />전체선택</label>
            <ul className="cart">
                {items.map(item => (
                    <CartItem {...item} key={item.id} />
                ))}
            </ul>

        </>
    )
}

export default CartList

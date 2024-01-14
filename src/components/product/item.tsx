import { Link } from 'react-router-dom'
import { Product } from '../../graphql/products'
// import { cartItemSelector } from '../../recoils/cart'
// import { useRecoilState } from 'recoil'
import { graphqlFetcher } from '../../queryClient'
import { useMutation } from 'react-query'
import { ADD_CART, CartType } from '../../graphql/cart'

const ProductItem = ({
    id,
    imageUrl,
    price,
    title,
    description,
    createdAt
}: Product) => {
    const { mutate: addCart } = useMutation((id: string) => graphqlFetcher(ADD_CART, { id }))
    // const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id))
    // const addToCart = () => setCartAmount(prev => (prev || 0) + 1)

    return (
        <li className="product-item">
            <Link to={`/products/${id}`}>
                <p className="product-item__title">{title}</p>
                <img className="product-item__image" src={imageUrl} />
                <span className="product-item__price">${price}</span>
            </Link>
            <button className="product-item__add-cart" onClick={() => addCart(id)}>장바구니 담기</button>
        </li>
    )
}

export default ProductItem
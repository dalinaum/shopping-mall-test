import { Link } from 'react-router-dom'
import { Product } from '../../graphql/products'
import { graphqlFetcher } from '../../queryClient'
import { useMutation } from 'react-query'
import { ADD_CART } from '../../graphql/cart'

const AdminItem = ({ id, imageUrl, price, title }: Product) => {
    const { mutate: addCart } = useMutation((id: string) => graphqlFetcher(ADD_CART, { id }))

    return (
        <li className="product-item">
            <Link to={`/products/${id}`}>
                <p className="product-item__title">{title}</p>
                <img className="product-item__image" src={imageUrl} />
                <span className="product-item__price">₩{price}</span>
            </Link>
            <button className="product-item__add-cart" onClick={() => addCart(id)}>어드민!!!</button>
        </li>
    )
}

export default AdminItem
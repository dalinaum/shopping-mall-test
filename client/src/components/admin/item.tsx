import { Link } from 'react-router-dom'
import { Product } from '../../graphql/products'

const AdminItem = ({
    id,
    imageUrl,
    price,
    title,
    description,
    createdAt,
    isEditing,
    startEdit
}: Product & {
    isEditing: boolean
    startEdit: () => void
}
) => {
    if (isEditing) return (
        <li className="product-item">
            <form>
                <label>
                    상품명 <input name="title" type="text" required defaultValue={title}></input>
                </label>
                <label>
                    이미지URL: <input name="imageUrl" type="text" required defaultValue={imageUrl} />
                </label>
                <label>
                    상품가격: <input name="price" type="number" required min="1000" defaultValue={price} />
                </label>
                <label>
                    상세: <textarea name="description" defaultValue={description} />
                </label>
                <button type="submit">저장</button>
            </form>
        </li>
    )
    return (
        <li className="product-item">
            <Link to={`/products/${id}`}>
                <p className="product-item__title">{title}</p>
                <img className="product-item__image" src={imageUrl} />
                <span className="product-item__price">₩{price}</span>
            </Link>
            {!createdAt && <span>삭제된 상품</span>}
            <button className="product-item__add-cart" onClick={startEdit }>
                수정
            </button>
        </li>
    )
}

export default AdminItem
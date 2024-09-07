import { Product } from "../../graphql/products"
import AdminItem from "./item"

const AdminList = ({ list, editingIndex, startEdit }: {
    list: {
        products: Product[]
    }[]
    editingIndex: number | null
    startEdit: (index: number) => () => void
}) => (
    <ul className="products">
        {list.map(page => page.products.map((product, i) =>
            <AdminItem
                {...product}
                key={product.id}
                isEditing={editingIndex === i}
                startEdit={startEdit(i)}
            />
        ))}
    </ul>
)

export default AdminList
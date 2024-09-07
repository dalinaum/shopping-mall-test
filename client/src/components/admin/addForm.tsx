import { SyntheticEvent } from "react"
import { ADD_PRODUCT, Product } from "../../graphql/products"
import { useMutation } from "react-query"
import { getClient, graphqlFetcher, QueryKeys } from "../../queryClient"
import arrToObj from "../../util/arrToObj"

type OmittedProduct = Omit<Product, 'id' | 'createdAt'>

const AddForm = () => {
    const queryClient = getClient()

    const { mutate: addProduct } = useMutation(
        ({
            title,
            imageUrl,
            price,
            description
        }: OmittedProduct) =>
            graphqlFetcher<{ addProduct: Product }>(ADD_PRODUCT, {
                title,
                imageUrl,
                price,
                description
            }),
        {
            // onSuccess: ({ addProduct }) => {
            onSuccess: () => {
                // 1) invalidateQueries - 서버에 요청을 다시함.
                queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
                    exact: false,
                    refetchInactive: true
                })

                // 2) 서버에 요청을 하지 않고 응답만 보고 캐시를 업데이트.
                // const adminData = queryClient.getQueriesData<{
                //     pageParams: (number | undefined)[]
                //     pages: Products[]
                // }>([QueryKeys.PRODUCTS, true])

                // const [adminKeys, { pageParams: adminParams, pages: adminPages }] = adminData[0]
                // const newAdminPages = [...adminPages]
                // newAdminPages[0].products = [addProduct, ...newAdminPages[0].products]

                // queryClient.setQueriesData(adminKeys, { pageParams: adminParams, pages: newAdminPages })

                // const productsData = queryClient.getQueriesData<{
                //     pageParams: (number | undefined)[]
                //     pages: Products[]
                // }>([QueryKeys.PRODUCTS, false])

                // const [productsKeys, { pageParams: productsParams, pages: productsPages }] = productsData[0]
                // const newProductsPages = [...productsPages]
                // newProductsPages[0].products = [addProduct, ...newProductsPages[0].products]
                // queryClient.setQueriesData(productsKeys, { pageParams: productsParams, pages: newProductsPages })
            },
        }
    )

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        const formData = arrToObj([... new FormData(e.target as HTMLFormElement)])
        formData.price = Number(formData.price)
        addProduct(formData as OmittedProduct)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                상품명 <input name="title" type="text" required></input>
            </label>
            <label>
                이미지URL: <input name="imageUrl" type="text" required />
            </label>
            <label>
                상품가격: <input name="price" type="number" required min="1000" />
            </label>
            <label>
                상세: <textarea name="description" />
            </label>
            <button type="submit">등록</button>
        </form>
    )
}

export default AddForm
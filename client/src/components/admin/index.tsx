import { useEffect, useRef, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { graphqlFetcher, QueryKeys } from "../../queryClient"
import AddForm from "./addForm"
import AdminList from "./list"
import GET_PRODUCTS, { Products } from "../../graphql/products"
import useIntersection from "../../hooks/useIntersection"

const Admin = () => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const fetchMoreRef = useRef<HTMLDivElement>(null)
    const intersecting = useIntersection(fetchMoreRef)

    const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<Products>(
        [QueryKeys.PRODUCTS, 'admin'],
        ({ pageParam = '' }) => graphqlFetcher<Products>(GET_PRODUCTS, {
            cursor: pageParam,
            showDeleted: true
        }),
        {
            getNextPageParam: lastPage => {
                return lastPage.products.at(-1)?.id
            }
        }
    )

    useEffect(() => {
        if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage) return
        fetchNextPage()
    }, [intersecting])

    const startEdit = (index: number) => {
        return () => {
            console.log("start edit!")
            return setEditingIndex(index)
        }
    }

    return (
        <>
            <AddForm />
            <AdminList list={data?.pages || []} editingIndex={editingIndex} startEdit={startEdit} />
            <div ref={fetchMoreRef}></div>
        </>
    )
}

export default Admin
import { useCallback, useEffect, useRef, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { graphqlFetcher, QueryKeys } from "../../queryClient"
import GET_PRODUCTS, { Products } from "../../graphql/products"
import ProductList from "../../components/product/list"

const ProductListPage = () => {
    const observerRef = useRef<IntersectionObserver>()
    const fetchMoreRef = useRef<HTMLDivElement>(null)
    const [intersecting, setIntersecting] = useState(false)

    const getObserver = useCallback(() => {
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(entries => {
                setIntersecting(entries[0]?.isIntersecting)
            })
        }
        return observerRef.current
    }, [observerRef.current])

    useEffect(() => {
        if (fetchMoreRef.current) getObserver().observe(fetchMoreRef.current)
    }, [fetchMoreRef.current])

    const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<Products>(
        QueryKeys.PRODUCTS,
        ({ pageParam = '' }) => graphqlFetcher<Products>(GET_PRODUCTS, { cursor: pageParam }),
        {
            getNextPageParam: lastPage => {
                return lastPage.products.at(-1)?.id
            }
        }
    )

    useEffect(() => {
        if (!intersecting || !isSuccess || !hasNextPage && isFetchingNextPage) return
        fetchNextPage()
    }, [intersecting])

    return (
        <div>
            <h2>상품목록</h2>
            <ProductList list={data?.pages || []} />
            <div ref={fetchMoreRef}></div>
        </div>
    )
}

export default ProductListPage
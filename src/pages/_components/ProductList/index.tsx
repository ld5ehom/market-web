import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import Product from '@/components/common/Product'
import Spinner from '@/components/common/Spinner'
import { getProducts } from '@/repository/products/getProducts'
import { Product as TProduct } from '@/types'

type Props = {
    initialProducts: TProduct[]
}

export default function ProductList({ initialProducts }: Props) {
    const [products, setProducts] = useState<TProduct[]>(initialProducts || [])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)
    const [page, setPage] = useState<number>(2) // Initial page index

    // Maximum number of items to display
    const MAX_ITEMS = 15

    const { ref, inView } = useInView({ threshold: 1 })

    // Function to fetch products and append them to the list
    const handleGetProducts = useCallback(
        async ({ fromPage, toPage }: { fromPage: number; toPage: number }) => {
            if (isLastPage) return // Prevent fetching if it's the last page
            try {
                setIsLoading(true)
                const { data = [] } = await getProducts({ fromPage, toPage })

                setProducts((prevProducts) => {
                    const updatedProducts = [...prevProducts, ...data]
                    if (
                        updatedProducts.length >= MAX_ITEMS ||
                        data.length === 0
                    ) {
                        setIsLastPage(true) // Stop fetching if no more data or reached max items
                    }
                    return updatedProducts.slice(0, MAX_ITEMS) // Ensure limit is respected
                })
            } finally {
                setIsLoading(false)
            }
        },
        [isLastPage, MAX_ITEMS],
    )

    // Initial fetch on component mount
    useEffect(() => {
        handleGetProducts({ fromPage: 0, toPage: 2 })
    }, [handleGetProducts])

    // Fetch additional products when inView is true
    useEffect(() => {
        if (inView && !isLastPage) {
            handleGetProducts({ fromPage: page, toPage: page + 1 })
            setPage((prevPage) => prevPage + 1)
        }
    }, [inView, handleGetProducts, isLastPage, page])

    return (
        <div className="my-8">
            <div className="grid grid-cols-5 gap-4">
                {products.map(({ id, title, price, imageUrls, createdAt }) => (
                    <Link
                        key={id}
                        className="rounded-lg overflow-hidden border"
                        href={`/products/${id}`}
                    >
                        <Product
                            title={title}
                            price={price}
                            imageUrl={imageUrls[0]}
                            createdAt={createdAt}
                        />
                    </Link>
                ))}
            </div>

            {/* Loading spinner */}
            {isLoading && (
                <div className="text-center mt-2">
                    <Spinner />
                </div>
            )}

            {/* Infinite scroll trigger */}
            {!isLastPage && products.length < MAX_ITEMS && <div ref={ref} />}
        </div>
    )
}

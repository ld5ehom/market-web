import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Product from '@/components/common/Product'
import Spinner from '@/components/common/Spinner'
import { getProducts } from '@/repository/products/getProducts'
import { Product as TProduct } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialProducts: TProduct[] // Initial list of products passed as props
}

export default function ProductList({ initialProducts }: Props) {
    const [products, setProducts] = useState<TProduct[]>(initialProducts) // State to store the list of products
    const { ref, inView } = useInView({ threshold: 1 }) // Intersection observer hook for infinite scroll
    const [isLoading, setIsLoading] = useState<boolean>(false) // Loading state
    const [isLastPage, setIsLastPage] = useState<boolean>(false) // Flag to check if it is the last page

    // Function to fetch products from the server
    const handleGetProducts = async ({
        fromPage,
        toPage,
    }: {
        fromPage: number
        toPage: number
    }) => {
        try {
            setIsLoading(true) // Start loading
            const { data } = await getProducts(supabase, { fromPage, toPage })
            setProducts((prevProducts) => [...prevProducts, ...data]) // Append new products to the existing list

            if (data.length === 0) {
                setIsLastPage(true) // If no more products, set isLastPage to true
            }
        } finally {
            setIsLoading(false) // End loading
        }
    }

    // Initial page starts at 2 (since first two pages are loaded initially)
    const [page, setPage] = useState<number>(2)

    useEffect(() => {
        if (inView) {
            // If the last product is in view, fetch the next page of products
            ;(async () => {
                handleGetProducts({ fromPage: page, toPage: page + 1 })
                setPage(page + 1) // Increment the page number after fetching
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]) // Only re-run if inView changes (when the last item is visible)

    return (
        <div className="my-8">
            <div className="grid grid-cols-5 gap-4">
                {/* Render each product */}
                {products?.map(({ id, title, price, imageUrls, createdAt }) => (
                    <Link key={id} href={`/products/${id}`}>
                        <Product
                            title={title}
                            price={price}
                            imageUrl={imageUrls[0]}
                            createdAt={createdAt}
                        />
                    </Link>
                ))}
            </div>

            {/* Show a loading spinner while fetching */}
            {isLoading && (
                <div className="text-center mt-2">
                    <Spinner />
                </div>
            )}

            {/* Infinite scroll trigger - load more products if there are more pages */}
            {!isLastPage && !!products.length && products.length < 100 && (
                <div ref={ref} /> // Reference to the last product for triggering the fetch
            )}
        </div>
    )
}

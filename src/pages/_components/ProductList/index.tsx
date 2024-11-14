import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { throttle } from 'lodash'

import Product from '@/components/common/Product'
import Spinner from '@/components/common/Spinner'
import { getProducts } from '@/repository/products/getProducts'
import { Product as TProduct } from '@/types'

type Props = {
    /** Initial product list */
    // 초기 상품 목록
    initialProducts: TProduct[]
}

export default function ProductList({ initialProducts }: Props) {
    // State to manage the product list
    // 상품 상태를 초기 상품으로 설정
    const [products, setProducts] = useState<TProduct[]>(initialProducts)

    // Maximum number of items to display
    // 표시할 최대 아이템 수
    const MAX_ITEMS = 50

    // react-intersection-observer to detect when elements come into view
    // react-intersection-observer를 사용하여 요소가 보일 때를 감지
    const { ref, inView } = useInView({ threshold: 1 })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)

    // Function to fetch products and append them to the list
    // 제품을 가져와서 목록에 추가하는 함수
    const fetchProducts = async ({
        fromPage,
        toPage,
    }: {
        fromPage: number
        toPage: number
    }) => {
        try {
            setIsLoading(true)
            const { data } = await getProducts({ fromPage, toPage })

            // Append new data to the previous product list, limiting to MAX_ITEMS
            // 이전 제품 목록에 새로운 데이터를 추가하되, MAX_ITEMS로 제한
            setProducts((prevProducts) => {
                const updatedProducts = [...prevProducts, ...data]
                if (updatedProducts.length > MAX_ITEMS) {
                    return updatedProducts.slice(0, MAX_ITEMS)
                }
                return updatedProducts
            })

            // If no more data or maximum items reached, set isLastPage to true
            // 더 이상 데이터가 없거나 최대 아이템 수에 도달하면 isLastPage를 true로 설정
            if (data.length === 0 || products.length >= MAX_ITEMS) {
                setIsLastPage(true)
            }
        } catch (error) {
            // Log an error message if the API request fails
            // API 요청이 실패하면 오류 메시지를 기록
            console.error('Failed to fetch products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Throttle the fetchProducts function to limit how often it can be called
    // fetchProducts 함수를 쓰로틀링하여 호출 빈도를 제한
    const handleGetProducts = throttle(fetchProducts, 1000) // 1000ms throttle time

    useEffect(() => {
        // When the component mounts, fetch products up to page 2
        // 컴포넌트가 마운트되면 페이지 2까지의 제품을 가져옴
        handleGetProducts({ fromPage: 0, toPage: 2 })
    }, [handleGetProducts])

    // Assume that the products are already loaded up to page 2
    // 제품이 이미 페이지 2까지 로드되었다고 가정
    const [page, setPage] = useState<number>(2)

    useEffect(() => {
        if (inView && !isLastPage) {
            // When inView becomes true and not the last page, fetch the next page
            // inView가 true가 되고 마지막 페이지가 아닐 때, 다음 페이지를 가져옴
            handleGetProducts({ fromPage: page, toPage: page + 1 })
            setPage(page + 1)
        }
    }, [inView, isLastPage, handleGetProducts, page])

    // If there are no initial products and loading is not happening, show a message
    // 초기 상품이 없고 로딩 중이 아닐 경우 메시지를 표시
    if (initialProducts.length === 0 && !isLoading) {
        return <div className="text-center">No products available</div>
        // 상품이 없습니다
    }

    return (
        <div className="my-8">
            <div className="grid grid-cols-5 gap-4 my-3">
                {products.map(({ id, title, price, imageUrls, createdAt }) => (
                    <div key={id} className="rounded-lg overflow-hidden border">
                        <Product
                            title={title}
                            price={price}
                            // Use fallback image if image URL is missing (이미지 URL이 없을 경우 대체 이미지를 사용)
                            imageUrl={imageUrls[0] || 'fallback-image-url.jpg'}
                            createdAt={createdAt}
                        />
                    </div>
                ))}
            </div>
            {isLoading && (
                // Show a loading spinner when data is being loaded (데이터를 로드 중일 때 로딩 스피너를 표시)
                <div className="text-center mt-2">
                    <Spinner />
                </div>
            )}
            {!isLastPage &&
                !!products.length &&
                products.length < MAX_ITEMS && (
                    // Render an invisible div to track when it comes into view
                    // 보일 때를 추적하기 위해 보이지 않는 div를 렌더링
                    <div ref={ref} />
                )}
        </div>
    )
}

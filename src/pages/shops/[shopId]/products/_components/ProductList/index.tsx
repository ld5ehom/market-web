import Link from 'next/link'
import { useEffect, useState } from 'react'
import Pagination from '@/components/common/Pagination'
import Product from '@/components/common/Product'
import Text from '@/components/common/Text'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { Product as TProduct } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialProducts?: TProduct[] // Initial list of products fetched via server-side rendering (SSR) (서버사이드 렌더링으로 가져온 초기 상품 목록)
    count: number // Total number of products in the shop (상점 내 총 상품 수)
    shopId: string // Shop ID for fetching products (상품 데이터를 가져올 상점 ID)
}

/**
 * Product List Component
 * Displays a paginated list of products for a shop, with dynamic data fetching based on the selected page.
 * (상점의 상품 목록을 페이징하여 표시하며, 선택한 페이지에 따라 동적으로 데이터를 가져옵니다.)
 */
export default function ProductList({
    initialProducts = [],
    count,
    shopId,
}: Props) {
    // State to manage the current page (UI starts at 1, API starts at 0)
    // 현재 페이지를 관리하는 상태 (UI는 1부터 시작, API는 0부터 시작)
    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState(initialProducts) // State to  the current list of products (현재 상품 목록을 저장하는 상태)

    // Fetch products dynamically when the page or shopId changes
    // 페이지나 상점 ID가 변경될 때 동적으로 상품을 가져옵니다.
    useEffect(() => {
        ;(async () => {
            const { data } = await getShopProducts(supabase, {
                shopId,
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setProducts(data) // Update the product list state (상품 목록 상태 업데이트)
        })()
    }, [currentPage, shopId]) // Dependencies: currentPage, shopId (의존성: currentPage, shopId)

    return (
        <div>
            {products.length === 0 ? ( // Display message when no products are available (등록된 상품이 없을 때 메시지 표시)
                <Text color="grey"> No products available. </Text>
            ) : (
                <>
                    {/* Grid layout to display products */}
                    <div className="w-full grid grid-cols-5 gap-4">
                        {products.map(
                            ({
                                id,
                                title,
                                price,
                                createdAt,
                                imageUrls,
                                purchaseBy,
                            }) => (
                                <Link href={`/products/${id}`} key={id}>
                                    <Product
                                        title={title} // Product title (상품 제목)
                                        price={price} // Product price (상품 가격)
                                        createdAt={createdAt} // Creation date (등록 날짜)
                                        imageUrl={imageUrls[0]} // Main product image (상품 이미지)
                                        isSoldOut={!!purchaseBy} // Sold-out status (품절 여부)
                                    />
                                </Link>
                            ),
                        )}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center mt-2">
                        <Pagination
                            currentPage={currentPage}
                            handlePageChange={(pageNumber) =>
                                setCurrentPage(pageNumber)
                            }
                            count={count}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

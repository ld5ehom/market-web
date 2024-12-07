import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '@/components/common/Button'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { Product } from '@/types'
import Image from 'next/image' // Use next/image for optimized image handling (이미지 최적화를 위한 next/image 사용)

type Props = {
    initialProducts: Product[] // Initial product list (초기 상품 리스트)
    count: number // Total product count (전체 상품 수)
    shopId: string // Shop ID (상점 ID)
}

dayjs.extend(relativeTime).locale('en')

// Fetch and display products for a shop with options to edit or delete products.
// (핵심내용: 상점 상품을 가져와 표시하며, 수정 및 삭제 옵션을 제공.)
export default function ProductList({ initialProducts, count, shopId }: Props) {
    const [currentPage, setCurrentPage] = useState(1) // Current page state (현재 페이지 상태)
    const [products, setProducts] = useState(initialProducts) // Product list state (상품 리스트 상태)

    // Fetch products whenever currentPage or shopId changes (currentPage 또는 shopId 변경 시 상품 데이터 가져오기)
    useEffect(() => {
        ;(async () => {
            const { data } = await getShopProducts({
                shopId,
                fromPage: currentPage - 1, // Adjust to zero-based index (0부터 시작하는 인덱스로 조정)
                toPage: currentPage,
            })
            setProducts(data)
        })()
    }, [currentPage, shopId])

    // Handle edit product action (상품 수정 액션 처리)
    const handleEditProduct = (productId: string) => {
        alert('EDIT')
    }

    // Handle delete product action (상품 삭제 액션 처리)
    const handleDeleteProduct = (productId: string) => {
        alert('DELETE')
    }

    return (
        <div>
            {/* Display message if no products are available (등록된 상품이 없을 경우 메시지 표시) */}
            {products.length === 0 ? (
                <div className="py-5 text-center">
                    <Text>No products registered.</Text>
                </div>
            ) : (
                <>
                    {/* Render list of products (상품 리스트 렌더링) */}
                    {products.map(
                        ({
                            id,
                            imageUrls,
                            title,
                            purchaseBy,
                            price,
                            createdAt,
                        }) => (
                            <div
                                key={id}
                                className="flex text-center border-y-2 my-4 py-2"
                            >
                                {/* Product image */}
                                <div className="w-28 h-28 relative">
                                    <Image
                                        src={imageUrls[0]} // Product image URL (상품 이미지 URL)
                                        alt={title} // Product title as alt text (상품 제목을 alt로 사용)
                                        fill
                                        className="object-cover" // Ensure image covers the container (이미지가 컨테이너를 채우도록 설정)
                                    />
                                </div>

                                {/* Product status */}
                                <div className="w-28 flex justify-center items-center">
                                    <Text>
                                        {!purchaseBy ? 'Available' : 'Sold'}
                                    </Text>{' '}
                                </div>

                                {/* Product title with link */}
                                <div className="flex-1 flex justify-center items-center">
                                    <Link href={`/products/${id}`}>
                                        <Text>{title}</Text>
                                    </Link>
                                </div>

                                {/* Product price */}
                                <div className="w-28 flex justify-center items-center">
                                    <Text>{price.toLocaleString()}</Text>
                                </div>

                                {/* Product Registered time (*/}
                                <div className="w-32 flex justify-center items-center">
                                    <Text>{dayjs(createdAt).fromNow()}</Text>
                                </div>

                                {/* Action buttons for editing and deleting */}
                                <div className="w-32 flex justify-center items-center">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            color="uclaBlue"
                                            className="h-8 w-15"
                                            onClick={() =>
                                                handleEditProduct(id)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="uclaBlue"
                                            className="h-8 w-15"
                                            disabled={!!purchaseBy} // Disable delete button if sold (판매완료 시 삭제 비활성화)
                                            onClick={() =>
                                                handleDeleteProduct(id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ),
                    )}

                    {/* Pagination component */}
                    <div className="flex justify-center">
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

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopSells } from '@/repository/shops/getShopSells'
import { Product } from '@/types'
import Button from '@/components/common/Button'
import Image from 'next/image'

type Props = {
    initialProducts: Product[]
    count: number
    shopId: string
}

export default function BuyProductList({
    initialProducts,
    count,
    shopId,
}: Props) {
    const [products, setProducts] = useState(initialProducts)
    const [currentPage, setCurrentPage] = useState(1)

    // Fetches purchased product data when the page or shop ID changes (페이지나 상점 ID가 변경될 때 구매 상품 데이터를 가져옴)
    useEffect(() => {
        ;(async () => {
            const { data } = await getShopSells({
                shopId,
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setProducts(data) // Updates the product state with fetched data (가져온 데이터로 상품 상태를 업데이트)
        })()
    }, [currentPage, shopId])

    return (
        <div>
            {/* Displays a message if no purchase history exists (구매 내역이 없으면 메시지를 표시) */}
            {products.length === 0 ? (
                <div className="pt-5 text-center">
                    {/* 구매 내역이 없습니다 */}
                    <Text>No purchase history found</Text>{' '}
                </div>
            ) : (
                <>
                    {/* Maps over products to display a list of purchased items (상품 목록을 순회하여 구매 내역을 표시) */}
                    {products.map(({ id, imageUrls, title, price }) => (
                        <div
                            key={id}
                            className="flex text-center border-y-2 my-4 py-2"
                        >
                            <div className="w-28 h-28 relative">
                                <Image
                                    src={imageUrls[0]}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 flex justify-center items-center">
                                <Link href={`/products/${id}`}>
                                    <Text>{title}</Text>
                                </Link>
                            </div>
                            <div className="w-28 flex justify-center items-center">
                                <Text>{price.toLocaleString()}</Text>
                            </div>

                            {/* Button to write a review for the purchased product (구매한 상품에 대한 후기를 작성하는 버튼) */}
                            <div className="w-44 flex justify-center items-center">
                                <Button
                                    color="uclaBlue"
                                    className="flex justify-center items-center gap-1 rounded-full"
                                >
                                    <span
                                        style={{ fontSize: '1rem' }}
                                        className="material-symbols-outlined"
                                    >
                                        rate_review
                                    </span>
                                    Write a Review {/* 후기작성 */}
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
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

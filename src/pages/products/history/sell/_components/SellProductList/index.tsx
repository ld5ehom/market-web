import Link from 'next/link'
import { useEffect, useState } from 'react'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopSells } from '@/repository/shops/getShopSells'
import { Product } from '@/types'
import Image from 'next/image'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialProducts: Product[]
    count: number
    shopId: string
}

export default function SellProductList({
    initialProducts,
    count,
    shopId,
}: Props) {
    const [products, setProducts] = useState(initialProducts)
    const [currentPage, setCurrentPage] = useState(1)

    // Fetches product data when the page or shop ID changes (페이지나 상점 ID가 변경될 때 상품 데이터를 가져옴)
    useEffect(() => {
        ;(async () => {
            const { data } = await getShopSells(supabase, {
                shopId,
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setProducts(data) // Updates the product state with fetched data (가져온 데이터로 상품 상태를 업데이트)
        })()
    }, [currentPage, shopId])

    return (
        <div>
            {/* Displays a message if no sales history exists (판매 내역이 없으면 메시지를 표시) */}
            {products.length === 0 ? (
                <div className="pt-5 text-center">
                    <Text>No sales history found</Text>{' '}
                    {/* 판매 내역이 없습니다 */}
                </div>
            ) : (
                <>
                    {/* Maps over products to display a list of sales (상품 목록을 순회하여 판매 내역을 표시) */}
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

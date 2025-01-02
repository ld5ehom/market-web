import { useEffect, useState } from 'react'
import BuyProductItem from '../BuyProductItem'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopSells } from '@/repository/shops/getShopSells'
import { Product } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialProducts?: Product[]
    count: number
    shopId: string
}

export default function BuyProductList({
    initialProducts = [],
    count,
    shopId,
}: Props) {
    const [products, setProducts] = useState(initialProducts)
    const [currentPage, setCurrentPage] = useState(1)

    // Fetches purchased product data when the page or shop ID changes (페이지나 상점 ID가 변경될 때 구매 상품 데이터를 가져옴)
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
                        <BuyProductItem
                            key={id}
                            id={id}
                            title={title}
                            price={price}
                            imageUrl={imageUrls[0]}
                        />
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

import { useEffect, useState } from 'react'

import LikeItem from '../LikeItem'

import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopLikes } from '@/repository/shops/getShopLikes'
import { Like } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialLikes: Like[] // The initial list of liked items (초기 찜한 상품 목록)
    count: number // The total count of liked items (찜한 상품의 총 개수)
    shopId: string // The ID of the shop (상점 ID)
}

export default function LikeList({ initialLikes, count, shopId }: Props) {
    // The page number visible to the user starts from 1, but the API starts from 0
    // 화면에 보이는 페이지 번호는 1부터 시작하지만 API는 0부터 시작합니다.
    const [currentPage, setCurrentPage] = useState(1)
    const [likes, setLikes] = useState(initialLikes)

    useEffect(() => {
        ;(async () => {
            const { data } = await getShopLikes(supabase, {
                shopId,
                // Adjusting the page numbers for the API request (API 요청을 위해 페이지 번호 조정)
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setLikes(data)
        })()
    }, [currentPage, shopId])

    return (
        <div>
            {likes.length === 0 ? (
                // Display message when there are no liked items (찜한 상품이 없을 때 메시지 표시)
                <Text color="grey"> No liked products. </Text>
            ) : (
                <>
                    {/* Grid layout for liked items (찜한 상품을 위한 그리드 레이아웃) */}
                    <div className="w-full grid grid-cols-5 gap-4">
                        {likes.map(({ id, productId }) => (
                            <LikeItem key={id} productId={productId} />
                        ))}
                    </div>
                    {/* Pagination controls (페이지네이션 컨트롤) */}
                    <div className="flex justify-end">
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

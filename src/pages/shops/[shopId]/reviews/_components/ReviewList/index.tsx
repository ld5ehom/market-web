import { useEffect, useState } from 'react'
import ReviewItem from '../ReviewItem'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopReviews } from '@/repository/shops/getShopReviews'
import { Review } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialReviews: Review[] // Preloaded reviews from SSR (서버사이드 렌더링으로 미리 불러온 리뷰)
    count: number // Total number of reviews (총 리뷰 개수)
    shopId: string // Shop ID to fetch reviews (리뷰를 가져오기 위한 상점 ID)
}

/**
 * Review List Component
 * Dynamically displays a paginated list of reviews for a shop.
 * (상점을 위한 리뷰 목록을 동적으로 페이지네이션과 함께 표시)
 */
export default function ReviewList({ initialReviews, count, shopId }: Props) {
    // Current visible page for UI starts at 1; API pages start at 0
    // 화면에서 보이는 페이지는 1부터 시작, API 페이지는 0부터 시작
    const [currentPage, setCurrentPage] = useState(1) // Current page state (현재 페이지 상태)
    const [reviews, setReviews] = useState(initialReviews) // List of reviews (리뷰 목록 상태)

    useEffect(() => {
        // Fetch reviews whenever the current page or shopId changes
        // currentPage나 shopId가 변경될 때 리뷰를 가져옵니다.
        ;(async () => {
            const { data } = await getShopReviews(supabase, {
                shopId,
                // API requires 0-based page indices (API 요청은 0부터 시작하는 페이지 인덱스 사용)
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setReviews(data) // Update the reviews state (리뷰 상태를 업데이트)
        })()
    }, [currentPage, shopId])

    return (
        <div>
            {reviews.length === 0 ? (
                <Text color="grey"> No customer reviews. </Text>
            ) : (
                <>
                    {/* Render the list of reviews */}
                    <div>
                        {reviews.map(
                            ({
                                id,
                                createdBy,
                                productId,
                                contents,
                                createdAt,
                            }) => (
                                <ReviewItem
                                    key={id}
                                    reviewerId={createdBy} // ID of the reviewer (리뷰 작성자 ID)
                                    productId={productId} // ID of the reviewed product (리뷰된 상품 ID)
                                    contents={contents} // Review content (리뷰 내용)
                                    createdAt={createdAt} // Creation date of the review (리뷰 작성 날짜)
                                />
                            ),
                        )}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center py-2">
                        <Pagination
                            currentPage={currentPage}
                            handlePageChange={(pageNumber) =>
                                setCurrentPage(pageNumber)
                            } // Update page state when user navigates (페이지 변경 시 상태 업데이트)
                            count={count} // Total number of reviews (총 리뷰 개수)
                        />
                    </div>
                </>
            )}
        </div>
    )
}

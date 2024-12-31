import { useEffect, useState } from 'react'
import FollowingItem from '../FollowingItem'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopFollowing } from '@/repository/shops/getShopFollowing'
import { Follow } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialFollowing: Follow[] // Initial list of following shops (초기 팔로잉 상점 목록)
    count: number // Total number of following shops (팔로잉 상점 총 수)
    shopId: string // Shop ID to fetch following data (팔로잉 데이터를 가져올 상점 ID)
}

/**
 * Following List Component
 * Displays a paginated list of shops that the user is following.
 * (사용자가 팔로잉 중인 상점 목록을 페이지네이션 방식으로 표시)
 */
export default function FollowingList({
    initialFollowing,
    count,
    shopId,
}: Props) {
    // Current page for the user interface starts at 1; API pages start at 0
    // 화면에 보이는 페이지는 1부터 시작. API 요청은 0부터 시작
    const [currentPage, setCurrentPage] = useState(1) // State to track the current page (현재 페이지 상태)
    const [following, setFollowing] = useState(initialFollowing) // State to Marketplace the following list (팔로잉 목록 상태)

    // Fetch the list of following shops whenever the page or shopId changes
    // 페이지 또는 shopId가 변경될 때 팔로잉 상점 목록을 가져옴
    useEffect(() => {
        ;(async () => {
            const { data } = await getShopFollowing(supabase, {
                shopId,
                // Adjust API pages to match the current page
                // API 페이지를 현재 페이지에 맞게 조정
                fromPage: currentPage - 1,
                toPage: currentPage,
            })
            setFollowing(data)
        })()
    }, [currentPage, shopId]) // Dependencies: Re-run when currentPage or shopId changes

    return (
        <div>
            {/* If there are no following shops, display a message */}
            {/* 팔로잉 상점이 없으면 메시지를 표시 */}
            {following.length === 0 ? (
                <Text color="grey"> No following shops found. </Text>
            ) : (
                <>
                    {/* Render the list of following shops */}
                    {/* 팔로잉 상점 목록 렌더링 */}
                    <div>
                        {following.map(({ id, followingShopId }) => (
                            <FollowingItem key={id} shopId={followingShopId} />
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={currentPage} // Current page state (현재 페이지 상태)
                            handlePageChange={(pageNumber) =>
                                setCurrentPage(pageNumber)
                            } // Update page number on navigation (탐색 시 페이지 번호 업데이트)
                            count={count} // Total number of following shops (팔로잉 상점 총 수)
                        />
                    </div>
                </>
            )}
        </div>
    )
}

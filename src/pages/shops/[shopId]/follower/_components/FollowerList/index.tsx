import { useEffect, useState } from 'react'
import FollowerItem from '../FollowerItem'
import Pagination from '@/components/common/Pagination'
import Text from '@/components/common/Text'
import { getShopFollower } from '@/repository/shops/getShopFollower'
import { Follow } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    initialFollower: Follow[] // Initial follower data (초기 팔로워 데이터)
    count: number // Total follower count (전체 팔로워 수)
    shopId: string // Shop ID (상점 ID)
}

// FollowerList Component - Display list of followers with pagination
// (FollowerList 컴포넌트 - 페이지네이션을 포함한 팔로워 리스트 표시)
export default function FollowerList({
    initialFollower,
    count,
    shopId,
}: Props) {
    // State for the current page (현재 페이지 상태)
    const [currentPage, setCurrentPage] = useState(1) // Display page starts at 1 (화면 표시 페이지는 1부터 시작)
    const [follower, setFollower] = useState(initialFollower) // Follower data state (팔로워 데이터 상태)

    // Fetch followers when currentPage or shopId changes (currentPage 또는 shopId 변경 시 팔로워 데이터 가져오기)
    useEffect(() => {
        ;(async () => {
            const { data } = await getShopFollower(supabase, {
                shopId,
                fromPage: currentPage - 1, // API starts pages at 0 (API는 0부터 페이지 시작)
                toPage: currentPage, // Fetch current page followers (현재 페이지 팔로워 가져오기)
            })
            setFollower(data)
        })()
    }, [currentPage, shopId])

    return (
        <div>
            {/* No followers message */}
            {follower.length === 0 ? (
                // Display message if no followers exist (팔로워 없을 경우 메시지 표시)
                <Text color="uclaBlue">No followers exist.</Text>
            ) : (
                <>
                    {/* Follower list display (팔로워 리스트 표시) */}
                    <div>
                        {follower.map(({ id, createdBy }) => (
                            <FollowerItem key={id} shopId={createdBy} />
                        ))}
                    </div>

                    {/* Pagination component for navigating pages (페이지네이션 컴포넌트로 페이지 탐색) */}
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={currentPage} // Current page state (현재 페이지 상태)
                            handlePageChange={(pageNumber) =>
                                setCurrentPage(pageNumber)
                            } // Update currentPage on change (페이지 변경 시 업데이트)
                            count={count} // Total followers count for pagination (전체 팔로워 수를 페이지네이션에 사용)
                        />
                    </div>
                </>
            )}
        </div>
    )
}

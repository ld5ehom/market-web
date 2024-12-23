import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ShopLayout from '../../_components/ShopLayout'
import FollowerList from './_components/FollowerList'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollower } from '@/repository/shops/getShopFollower'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopFollowingCount } from '@/repository/shops/getShopFollowingCount'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopReviewCount } from '@/repository/shops/getShopReviewCount'
import { Follow, Shop } from '@/types'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

// Server-side rendering for fetching shop and follower data
// (서버사이드 렌더링으로 상점 및 팔로워 데이터 가져오기)
export const getServerSideProps: GetServerSideProps<{
    isMyShop: boolean // Check my shop
    shop: Shop // Shop information (상점 정보)
    productCount: number // Number of products (상품 개수)
    reviewCount: number // Number of reviews (리뷰 개수)
    likeCount: number // Number of likes (좋아요 개수)
    followingCount: number // Number of following shops (팔로잉 상점 수)
    followerCount: number // Number of followers (팔로워 수)
    follower: Follow[] // Follower data (팔로워 데이터)
}> = async (context) => {
    const supabase = getServerSupabase(context)
    const shopId = context.query.shopId as string

    const [
        {
            data: { shopId: myShopId },
        },
        { data: shop }, // Fetch shop details (상점 정보 가져오기)
        { data: productCount }, // Fetch product count (상품 개수 가져오기)
        { data: reviewCount }, // Fetch review count (리뷰 개수 가져오기)
        { data: likeCount }, // Fetch like count (좋아요 개수 가져오기)
        { data: followingCount }, // Fetch following count (팔로잉 수 가져오기)
        { data: followerCount }, // Fetch follower count (팔로워 수 가져오기)
        { data: follower }, // Fetch initial follower list (초기 팔로워 리스트 가져오기)
    ] = await Promise.all([
        getMe(supabase),
        getShop(supabase, shopId),
        getShopProductCount(shopId),
        getShopReviewCount(shopId),
        getShopLikeCount(shopId),
        getShopFollowingCount(shopId),
        getShopFollowerCount(shopId),
        getShopFollower({ shopId, fromPage: 0, toPage: 1 }),
    ])
    return {
        props: {
            isMyShop: myShopId === shopId,
            shop,
            productCount,
            reviewCount,
            likeCount,
            followingCount,
            followerCount,
            follower,
        },
    }
}

// Follower Component - Display shop follower details
// (Follower 컴포넌트 - 상점 팔로워 상세 표시)
// Renders the follower count and a paginated list of followers for a specific shop.
//  특정 상점의 팔로워 수를 표시하고, 페이지네이션으로 탐색 가능한 팔로워 리스트 렌더링
export default function Follower({
    isMyShop,
    shop,
    productCount,
    reviewCount,
    likeCount,
    followingCount,
    followerCount,
    follower: initialFollower,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <ShopLayout
            isMyShop={isMyShop} // Check My shop
            shop={shop} // Shop information (상점 정보)
            productCount={productCount} // Product count (상품 개수)
            reviewCount={reviewCount} // Review count (리뷰 개수)
            likeCount={likeCount} // Like count (좋아요 개수)
            followingCount={followingCount} // Following count (팔로잉 수)
            followerCount={followerCount} // Follower count (팔로워 수)
            currentTab="follower" // Set current tab to 'follower' (현재 탭을 '팔로워'로 설정)
        >
            {/* Follower count display  */}
            <div className="mt-9 mb-5">
                <Text size="lg">Followers </Text>
                <Text size="lg" color="uclaBlue">
                    {followerCount.toLocaleString()}{' '}
                </Text>
            </div>
            {/* Render follower list with pagination (페이지네이션을 포함한 팔로워 리스트 표시) */}
            <FollowerList
                initialFollower={initialFollower} // Initial follower data (초기 팔로워 데이터)
                count={followerCount} // Total follower count (전체 팔로워 수)
                shopId={shop.id} // Shop ID (상점 ID)
            />
        </ShopLayout>
    )
}

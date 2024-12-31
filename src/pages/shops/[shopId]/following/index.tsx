import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ShopLayout from '../../_components/ShopLayout'
import FollowingList from './_components/FollowingList'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopFollowing } from '@/repository/shops/getShopFollowing'
import { getShopFollowingCount } from '@/repository/shops/getShopFollowingCount'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopReviewCount } from '@/repository/shops/getShopReviewCount'
import { Follow, Shop } from '@/types'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

/**
 * Server-side data fetching for the following page
 * 팔로잉 페이지를 위한 서버사이드 데이터 가져오기
 */
export const getServerSideProps: GetServerSideProps<{
    isMyShop: boolean
    shop: Shop // Shop information (상점 정보)
    productCount: number // Total product count (총 상품 수)
    reviewCount: number // Total review count (총 리뷰 수)
    likeCount: number // Total like count (총 찜 수)
    followingCount: number // Total following count (총 팔로잉 수)
    followerCount: number // Total follower count (총 팔로워 수)
    following: Follow[] // List of followed shops (팔로우한 상점 목록)
}> = async (context) => {
    const supabase = getServerSupabase(context)
    const shopId = context.query.shopId as string // Extract shopId from query parameters (쿼리에서 shopId 추출)

    // Fetch all required data in parallel
    // 병렬로 필요한 모든 데이터를 가져옴
    const [
        {
            data: { shopId: myShopId },
        },
        { data: shop },
        { data: productCount },
        { data: reviewCount },
        { data: likeCount },
        { data: followingCount },
        { data: followerCount },
        { data: following },
    ] = await Promise.all([
        getMe(supabase),
        getShop(supabase, shopId), // Fetch shop details (상점 정보 가져오기)
        getShopProductCount(supabase, shopId), // Fetch total product count (총 상품 수 가져오기)
        getShopReviewCount(supabase, shopId), // Fetch total review count (총 리뷰 수 가져오기)
        getShopLikeCount(supabase, shopId), // Fetch total like count (총 찜 수 가져오기)
        getShopFollowingCount(supabase, shopId), // Fetch total following count (총 팔로잉 수 가져오기)
        getShopFollowerCount(supabase, shopId), // Fetch total follower count (총 팔로워 수 가져오기)
        getShopFollowing(supabase, { shopId, fromPage: 0, toPage: 1 }), // Fetch followed shops (팔로우한 상점 가져오기)
    ])

    return {
        props: {
            isMyShop: myShopId === shopId,
            shop, // Shop details (상점 정보)
            productCount, // Product count (상품 수)
            reviewCount, // Review count (리뷰 수)
            likeCount, // Like count (찜 수)
            followingCount, // Following count (팔로잉 수)
            followerCount, // Follower count (팔로워 수)
            following, // Following list (팔로우한 상점 목록)
        },
    }
}

/**
 * Following Page Component
 * Displays a list of shops that the seller is following.
 * (판매자가 팔로잉 중인 상점 목록을 표시하는 페이지 컴포넌트)
 */
export default function Following({
    isMyShop,
    shop, // Shop details (상점 정보)
    productCount, // Product count (상품 수)
    reviewCount, // Review count (리뷰 수)
    likeCount, // Like count (찜 수)
    followingCount, // Following count (팔로잉 수)
    followerCount, // Follower count (팔로워 수)
    following: initialFollowing, // Initial following list (초기 팔로잉 목록)
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <ShopLayout
            isMyShop={isMyShop}
            shop={shop} // Pass shop details to layout (상점 정보를 레이아웃에 전달)
            productCount={productCount} // Total product count (총 상품 수)
            reviewCount={reviewCount} // Total review count (총 리뷰 수)
            likeCount={likeCount} // Total like count (총 찜 수)
            followingCount={followingCount} // Total following count (총 팔로잉 수)
            followerCount={followerCount} // Total follower count (총 팔로워 수)
            currentTab="following" // Set the current active tab to "following" (현재 활성 탭을 "following"으로 설정)
        >
            <div className="mt-9 mb-5">
                {/* Page title (페이지 제목) */}
                <Text size="lg"> Following </Text>{' '}
                <Text size="lg" color="uclaBlue">
                    {followingCount.toLocaleString()}{' '}
                </Text>
            </div>
            <FollowingList
                initialFollowing={initialFollowing} // Initial following list (초기 팔로잉 목록)
                count={followingCount} // Total number of following shops (총 팔로잉 수)
                shopId={shop.id} // Current shop ID (현재 상점 ID)
            />
        </ShopLayout>
    )
}

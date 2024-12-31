import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ShopLayout from '../../_components/ShopLayout'
import ReviewList from './_components/ReviewList'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopFollowingCount } from '@/repository/shops/getShopFollowingCount'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopReviewCount } from '@/repository/shops/getShopReviewCount'
import { getShopReviews } from '@/repository/shops/getShopReviews'
import { Review, Shop } from '@/types'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

/**
 * Fetches shop data for the review page (후기 페이지를 위한 상점 데이터 가져오기)
 * Retrieves shop details, counts (products, reviews, likes, following, followers), and reviews for the shop.
 * (상점 세부정보, 상품/리뷰/찜/팔로잉/팔로워 수, 후기를 가져옵니다.)
 */
export const getServerSideProps: GetServerSideProps<{
    isMyShop: boolean
    shop: Shop
    productCount: number
    reviewCount: number
    likeCount: number
    followingCount: number
    followerCount: number
    reviews: Review[]
}> = async (context) => {
    const supabase = getServerSupabase(context)
    const shopId = context.query.shopId as string

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
        { data: reviews },
    ] = await Promise.all([
        getMe(supabase),
        getShop(supabase, shopId), // Fetch shop details (상점 세부정보 가져오기)
        getShopProductCount(supabase, shopId), // Fetch product count (상품 수 가져오기)
        getShopReviewCount(supabase, shopId), // Fetch review count (리뷰 수 가져오기)
        getShopLikeCount(supabase, shopId), // Fetch like count (찜 수 가져오기)
        getShopFollowingCount(supabase, shopId), // Fetch following count (팔로잉 수 가져오기)
        getShopFollowerCount(supabase, shopId), // Fetch follower count (팔로워 수 가져오기)
        getShopReviews(supabase, { shopId, fromPage: 0, toPage: 1 }), // Fetch reviews (리뷰 가져오기)
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
            reviews,
        },
    }
}

/**
 * Shop Reviews Page Component
 * Displays the review section for the shop with dynamic shop details and reviews.
 * (상점에 대한 리뷰 섹션과 동적 상점 세부정보를 표시)
 */
export default function ShopReviews({
    isMyShop,
    shop,
    productCount,
    reviewCount,
    likeCount,
    followingCount,
    followerCount,
    reviews: initialReviews,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <ShopLayout
            isMyShop={isMyShop}
            shop={shop}
            productCount={productCount}
            reviewCount={reviewCount}
            likeCount={likeCount}
            followingCount={followingCount}
            followerCount={followerCount}
            currentTab="reviews" // Sets the active tab to reviews (현재 활성화된 탭을 'reviews'로 설정)
        >
            <div className="mt-9 mb-5">
                {/* Review title  */}
                <Text size="lg">Reviews : </Text>
                {/* Displays total number of reviews */}
                <Text size="lg" color="uclaBlue">
                    {reviewCount.toLocaleString()} reviews
                </Text>{' '}
            </div>

            <ReviewList
                initialReviews={initialReviews} // Initial review data
                count={reviewCount} // Total review count
                shopId={shop.id} // Shop ID
            />
        </ShopLayout>
    )
}

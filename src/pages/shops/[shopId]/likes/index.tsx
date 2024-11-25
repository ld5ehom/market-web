import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import LikeList from './_components/LikeList'

import Text from '@/components/common/Text'
import { getShop } from '@/repository/shops/getShop'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopLikes } from '@/repository/shops/getShopLikes'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { Like, Shop } from '@/types'

/**
 * Server-side data fetching for cart-related information
 * 카트 관련 정보를 서버에서 가져오는 함수
 */
export const getServerSideProps: GetServerSideProps<{
    shop: Shop // Shop information (상점 정보)
    productCount: number // Number of products in the shop (상점 내 상품 수)
    likeCount: number // Number of liked items in the cart (카트 내 찜한 상품 수)
    likes: Like[] // List of liked products in the cart (카트 내 찜한 상품 목록)
}> = async (context) => {
    const shopId = context.query.shopId as string // Extract shopId from query parameters (쿼리에서 shopId 추출)

    // Fetch shop-related data in parallel (병렬로 상점 관련 데이터 가져오기)
    const [
        { data: shop },
        { data: productCount },
        { data: likeCount },
        { data: likes },
    ] = await Promise.all([
        getShop(shopId), // Fetch shop information (상점 정보 가져오기)
        getShopProductCount(shopId), // Fetch product count (상품 수 가져오기)
        getShopLikeCount(shopId), // Fetch like count (찜한 상품 수 가져오기)
        getShopLikes({ shopId, fromPage: 0, toPage: 1 }), // Fetch list of liked products (찜한 상품 목록 가져오기)
    ])

    return {
        props: {
            shop, // Shop information (상점 정보)
            productCount, // Product count (상품 수)
            likeCount, // Like count (찜한 상품 수)
            likes, // Liked products list (찜한 상품 목록)
        },
    }
}

/**
 * Cart Page Component (카트 페이지 컴포넌트)
 */
export default function CartPage({
    shop, // Shop information (상점 정보)
    productCount, // Product count (상품 수)
    likeCount, // Like count (찜한 상품 수)
    likes: initialLikes, // Initial list of liked products (초기 찜한 상품 목록)
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="my-8 ">
            <div className="flex flex-col items-center">
                {/* Page Header */}
                <div className="mb-5 text-center">
                    {' '}
                    {/* Header를 중앙 정렬 */}
                    <Text size="xl" color="darkestBlue">
                        Shopping Cart :{' '}
                    </Text>
                    <Text size="xl">
                        {likeCount} item{likeCount > 1 ? 's' : ''} in your cart.
                    </Text>
                </div>

                {/* Liked Products List */}
                <div className="grid gap-4 justify-center items-center">
                    <LikeList
                        initialLikes={initialLikes} // Initial liked products list (초기 찜한 상품 목록)
                        count={likeCount} // Total like count (찜한 상품 수)
                        shopId={shop.id} // Current shop ID (현재 상점 ID)
                    />
                </div>
            </div>
        </div>
    )
}

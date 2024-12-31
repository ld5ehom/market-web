import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import ShopLayout from '../../_components/ShopLayout'
import ProductList from './_components/ProductList'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopFollowingCount } from '@/repository/shops/getShopFollowingCount'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { getShopReviewCount } from '@/repository/shops/getShopReviewCount'
import { Product, Shop } from '@/types'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

export const getServerSideProps: GetServerSideProps<{
    isMyShop: boolean
    shop: Shop
    productCount: number
    reviewCount: number
    likeCount: number
    followingCount: number
    followerCount: number
    products: Product[]
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
        { data: products },
    ] = await Promise.all([
        getMe(supabase),
        getShop(supabase, shopId),
        getShopProductCount(supabase, shopId),
        getShopReviewCount(supabase, shopId),
        getShopLikeCount(supabase, shopId),
        getShopFollowingCount(supabase, shopId),
        getShopFollowerCount(supabase, shopId),
        getShopProducts(supabase, { shopId, fromPage: 0, toPage: 1 }),
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
            products,
        },
    }
}

export default function ShopProducts({
    isMyShop,
    shop,
    productCount,
    reviewCount,
    likeCount,
    followingCount,
    followerCount,
    products,
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
            currentTab="products"
        >
            <div className="mt-9 mb-5">
                <Text size="lg"> Products : </Text>
                <Text size="lg" color="uclaBlue">
                    {productCount.toLocaleString()}
                </Text>
            </div>
            <ProductList
                initialProducts={products}
                count={productCount}
                shopId={shop.id}
            />
        </ShopLayout>
    )
}

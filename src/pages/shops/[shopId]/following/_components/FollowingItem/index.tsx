import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Shop from '@/components/common/Shop'
import Spinner from '@/components/common/Spinner'
import { getShop } from '@/repository/shops/getShop'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'
import { getShopProducts } from '@/repository/shops/getShopProducts'
import { Product, Shop as TShop } from '@/types'
import Image from 'next/image'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    shopId: string
}

export default function FollowingItem({ shopId }: Props) {
    const router = useRouter()
    const [data, setData] = useState<{
        shop: TShop // Shop data (상점 데이터)
        products: Product[] // Products list (상품 리스트)
        productCount: number // Total product count (상품 총 개수)
        followerCount: number // Total follower count (팔로워 총 수)
    }>()

    // Fetch shop details and related information when shopId changes
    // shopId가 변경될 때 상점 세부정보 및 관련 데이터를 가져옵니다.
    useEffect(() => {
        ;(async () => {
            const [
                { data: shop }, // Fetch shop details (상점 세부정보 가져오기)
                { data: products }, // Fetch products for the shop (상점의 상품 가져오기)
                { data: productCount }, // Fetch total product count (상품 총 개수 가져오기)
                { data: followerCount }, // Fetch total follower count (팔로워 총 수 가져오기)
            ] = await Promise.all([
                getShop(supabase, shopId),
                getShopProducts({ shopId, fromPage: 0, toPage: 1 }),
                getShopProductCount(shopId),
                getShopFollowerCount(shopId),
            ])
            setData({ shop, products, productCount, followerCount })
        })()
    }, [shopId])

    // Show a loading spinner until data is fetched
    // 데이터가 로드될 때까지 로딩 스피너를 표시합니다.
    if (!data) {
        return (
            <div className="border border-dashed flex justify-center items-center h-40 my-6">
                <Spinner />
            </div>
        )
    }

    // Destructure fetched data (가져온 데이터 구조 분해)
    const { shop, products, productCount, followerCount } = data

    return (
        <div className="flex gap-5 my-6">
            {/* Shop details section (상점 세부정보 섹션) */}
            <div className="flex items-center">
                <Shop
                    name={shop.name} // Shop name (상점 이름)
                    profileImageUrl={shop.imageUrl || undefined} // Profile image URL (프로필 이미지 URL)
                    productCount={productCount} // Total product count (상품 총 개수)
                    followerCount={followerCount} // Total follower count (팔로워 총 수)
                    handleClickTitle={() => router.push(`/shops/${shop.id}`)} // Navigate to shop page (상점 페이지로 이동)
                    handleClickProfileImage={() =>
                        router.push(`/shops/${shop.id}`)
                    } // Navigate to shop page (상점 페이지로 이동)
                    handleClickProductCount={
                        () => router.push(`/shops/${shop.id}/products`) // Navigate to product list (상품 리스트 페이지로 이동)
                    }
                    handleClickFollowerCount={
                        () => router.push(`/shops/${shop.id}/follower`) // Navigate to follower list (팔로워 리스트 페이지로 이동)
                    }
                    type="column" // Layout type for shop details (상점 세부정보 레이아웃 유형)
                />
            </div>

            {/* Display up to 3 products with links to their pages (최대 3개의 상품을 표시하며 상품 페이지로 이동하는 링크 포함) */}
            {products.slice(0, 4).map(({ imageUrls, id, title }) => (
                <Link href={`/products/${id}`} key={id}>
                    <div className="w-40 h-40 relative">
                        <Image
                            src={imageUrls[0]}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>
            ))}
        </div>
    )
}

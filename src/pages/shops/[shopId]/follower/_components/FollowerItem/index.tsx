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

// FollowerItem Component - Display shop details and products (상점 정보 및 상품 표시 컴포넌트)
export default function FollowerItem({ shopId }: Props) {
    const router = useRouter()
    const [data, setData] = useState<{
        shop: TShop
        products: Product[]
        productCount: number
        followerCount: number
    }>()

    // Fetch data using useEffect - Fetch shop and product information (데이터 비동기로 가져오기)
    useEffect(() => {
        ;(async () => {
            const [
                { data: shop }, // Fetch shop details (상점 정보 가져오기)
                { data: products }, // Fetch shop products (상점의 상품 리스트 가져오기)
                { data: productCount }, // Fetch product count (상점의 상품 개수 가져오기)
                { data: followerCount }, // Fetch follower count (상점의 팔로워 수 가져오기)
            ] = await Promise.all([
                getShop(supabase, shopId),
                getShopProducts({ shopId, fromPage: 0, toPage: 1 }),
                getShopProductCount(shopId),
                getShopFollowerCount(shopId),
            ])
            setData({
                shop,
                products,
                productCount,
                followerCount,
            })
        })()
    }, [shopId])

    // Show loading spinner while data is being fetched (데이터 로드 중 로딩 스피너 표시)
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
            {/* Shop details and interactive buttons (상점 정보와 버튼) */}
            <div className="flex items-center">
                <Shop
                    name={shop.name} // Shop name (상점 이름)
                    profileImageUrl={shop.imageUrl || undefined} // Shop profile image (상점 프로필 이미지)
                    productCount={productCount} // Number of products (상품 개수)
                    followerCount={followerCount} // Number of followers (팔로워 수)
                    handleClickTitle={() => router.push(`/shops/${shop.id}`)} // Navigate to shop page on title click (상점 이름 클릭 시 이동)
                    handleClickProfileImage={() =>
                        router.push(`/shops/${shop.id}`)
                    } // Navigate to shop page on profile image click (프로필 이미지 클릭 시 이동)
                    handleClickProductCount={
                        () => router.push(`/shops/${shop.id}/products`) // Navigate to shop products on count click (상품 개수 클릭 시 이동)
                    }
                    handleClickFollowerCount={
                        () => router.push(`/shops/${shop.id}/follower`) // Navigate to followers page on count click (팔로워 수 클릭 시 이동)
                    }
                    type="column" // Display type for the shop component (상점 컴포넌트 표시 타입)
                />
            </div>

            {/* Display up to 3 product images with links (최대 3개의 상품 이미지와 링크 표시) */}
            {products.slice(0, 4).map(({ imageUrls, id, title }) => (
                <Link href={`/products/${id}`} key={id}>
                    <div className="w-40 h-40 relative">
                        <Image
                            src={imageUrls[0]} // Product image URL (상품 이미지 URL)
                            alt={title} // Product title as alt text (상품 제목 alt 속성으로 사용)
                            fill
                            className="object-cover" // Ensure image covers the container (이미지가 컨테이너를 채우도록 설정)
                        />
                    </div>
                </Link>
            ))}
        </div>
    )
}

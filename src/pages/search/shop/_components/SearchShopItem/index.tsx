import Link from 'next/link'
import { useEffect, useState } from 'react'
import Shop from '@/components/common/Shop'
import Spinner from '@/components/common/Spinner'
import { getShopFollowerCount } from '@/repository/shops/getShopFollowerCount'
import { getShopProductCount } from '@/repository/shops/getShopProductCount'

type Props = {
    id: string // Shop ID used to fetch additional data (상점 ID, 추가 데이터를 가져오는데 사용됨)
    name: string // Shop name to display (표시할 상점 이름)
    profileImageUrl?: string // URL for the shop's profile image (상점 프로필 이미지의 URL)
}

// SearchShopItem component to display shop information and load counts
// 상점 정보를 표시하고 팔로워 및 상품 수를 로드하는 SearchShopItem 컴포넌트
export default function SearchShopItem({ id, name, profileImageUrl }: Props) {
    // State to store the follower count (팔로워 수를 저장하는 상태)
    const [followerCount, setFollowerCount] = useState<number | undefined>()

    // State to store the product count (상품 수를 저장하는 상태)
    const [productCount, setProductCount] = useState<number | undefined>()

    useEffect(() => {
        ;(async () => {
            // Fetch follower and product counts asynchronously (비동기로 팔로워 및 상품 수를 가져옴)
            const [{ data: followerCount }, { data: productCount }] =
                await Promise.all([
                    getShopFollowerCount(id),
                    getShopProductCount(id),
                ])

            setFollowerCount(followerCount) // Update the follower count state (팔로워 수 상태 업데이트)
            setProductCount(productCount) // Update the product count state (상품 수 상태 업데이트)
        })()
    }, [id])

    // Show a loading spinner if data is not yet loaded (데이터가 아직 로드되지 않은 경우 로딩 스피너를 표시)
    if (followerCount === undefined || productCount === undefined) {
        return (
            <div className="border border-lighterBlue h-28 flex justify-center items-center rounded-lg">
                <Spinner />
            </div>
        )
    }

    // Render the Shop component with the loaded data (로드된 데이터로 Shop 컴포넌트를 렌더링)
    return (
        <Link href={`/shops/${id}`}>
            <div className="border border-lighterBlue p-5 rounded-lg">
                <Shop
                    type="row"
                    name={name}
                    productCount={productCount}
                    followerCount={followerCount}
                    profileImageUrl={profileImageUrl}
                />
            </div>
        </Link>
    )
}

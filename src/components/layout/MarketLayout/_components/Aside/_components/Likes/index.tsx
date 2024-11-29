import Link from 'next/link'
import { useEffect, useState } from 'react'

import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getMe } from '@/repository/me/getMe'
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount'

/**
 * Likes Component (Cart Component)
 * Fetches and displays the number of products added to the cart for the current user's shop.
 * 현재 사용자의 상점에서 장바구니에 추가된 상품의 수를 가져와 표시합니다.
 */
export default function Likes() {
    // User's shop ID state (사용자의 상점 ID 상태)
    const [shopId, setShopId] = useState<string | null>(null)

    // Number of liked products (찜한 상품 수 상태)
    const [likeCount, setLikeCount] = useState<number>()

    useEffect(() => {
        // Fetch the user's shop ID and the number of liked products when the component mounts
        // 컴포넌트가 마운트될 때 사용자의 상점 ID와 찜한 상품 수를 가져옵니다.
        ;(async () => {
            const {
                data: { shopId },
            } = await getMe()

            if (!shopId) {
                setLikeCount(0) // If the user doesn't have a shop, set the like count to 0
                return
            }

            // Fetch the like count for the user's shop
            const { data: likeCount } = await getShopLikeCount(shopId)
            setShopId(shopId)
            setLikeCount(likeCount)
        })()
    }, [])

    return (
        <Link
            href={!shopId ? '#' : `/shops/${shopId}/likes`}
            className="border border-uclaBlue bg-white p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
            aria-label="Cart Section"
        >
            {/* Title for the cart section */}
            <Text size="md">Cart</Text>

            {/* Show a spinner while the data is loading */}
            {likeCount === undefined ? (
                <div className="mt-2">
                    <Spinner />
                </div>
            ) : (
                // Display the cart count once it's loaded
                <Link href={!shopId ? '#' : `/shops/${shopId}/likes`}>
                    <Text
                        size="lg"
                        color="uclaBlue"
                        className="flex gap-2 items-center mt-2"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '1.5rem' }}
                        >
                            shopping_cart
                        </span>
                        {likeCount}
                    </Text>
                </Link>
            )}
        </Link>
    )
}

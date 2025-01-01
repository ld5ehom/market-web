import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { getReviewByProductId } from '@/repository/reviews/getReviewByProductId'
import Image from 'next/image'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    id: string
    title: string
    price: number
    imageUrl: string
}

export default function BuyProductItem({ id, title, price, imageUrl }: Props) {
    const [isReviewPosted, setIsReviewPosted] = useState<boolean>()

    // Checks if a review has been posted for the product (상품에 대한 리뷰가 작성되었는지 확인)
    useEffect(() => {
        ;(async () => {
            const { data } = await getReviewByProductId(supabase, id) // Fetches review data for the product (상품의 리뷰 데이터를 가져옴)
            setIsReviewPosted(!!data) // Updates state based on the review existence (리뷰 존재 여부에 따라 상태 업데이트)
        })()
    }, [id])

    return (
        <div className="flex text-center border-y-2 my-4 py-2">
            {/* Product Image (상품 이미지) */}
            <div className="w-28 h-28 relative">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Product Title (상품 제목) */}
            <div className="flex-1 flex justify-center items-center">
                <Link href={`/products/${id}`}>
                    <Text>{title}</Text>
                </Link>
            </div>

            {/* Product Price (상품 가격) */}
            <div className="w-28 flex justify-center items-center">
                <Text>{price.toLocaleString()}</Text>
            </div>

            {/* Review Button (리뷰 작성 버튼) */}
            <div className="w-32 flex justify-center items-center">
                <Link href={`/reviews/${id}`} prefetch={false}>
                    <Button
                        disabled={isReviewPosted} // Disables button if a review has already been posted (리뷰가 이미 작성된 경우 버튼 비활성화)
                        isLoading={isReviewPosted === undefined} // Shows loading state if review status is not yet fetched (리뷰 상태를 가져오는 중 로딩 표시)
                        color="red"
                        className="flex justify-center items-center gap-1"
                    >
                        <span
                            style={{ fontSize: '1rem' }}
                            className="material-symbols-outlined"
                        >
                            rate_review
                        </span>
                        Write a Review
                    </Button>
                </Link>
            </div>
        </div>
    )
}

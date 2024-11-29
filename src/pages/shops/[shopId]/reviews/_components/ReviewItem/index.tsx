import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getProduct } from '@/repository/products/getProduct'
import { getShop } from '@/repository/shops/getShop'
import { Product, Shop } from '@/types'

type Props = {
    reviewerId: string // ID of the reviewer (리뷰 작성자 ID)
    productId: string // ID of the reviewed product (리뷰된 상품 ID)
    contents: string // Review content (리뷰 내용)
    createdAt: string // Creation date of the review (리뷰 작성 날짜)
}

// Initialize dayjs with relative time plugin
dayjs.extend(relativeTime).locale('en')

/**
 * Review Item Component
 * Displays an individual review with reviewer and product details.
 * (리뷰어와 제품 세부 정보를 표시하는 개별 리뷰 컴포넌트)
 */
export default function ReviewItem({
    reviewerId,
    productId,
    contents,
    createdAt,
}: Props) {
    // State to hold reviewer and product data (리뷰어와 제품 데이터를 저장하는 상태)
    const [data, setData] = useState<{ reviewer: Shop; product: Product }>()

    useEffect(() => {
        // Fetch reviewer and product data when the component mounts
        // 컴포넌트가 마운트될 때 리뷰어와 제품 데이터를 가져옵니다.
        ;(async () => {
            const [{ data: reviewer }, { data: product }] = await Promise.all([
                getShop(reviewerId), // Fetch reviewer data (리뷰어 데이터 가져오기)
                getProduct(productId), // Fetch product data (제품 데이터 가져오기)
            ])
            setData({ reviewer, product }) // Set the fetched data to state (가져온 데이터를 상태에 설정)
        })()
    }, [productId, reviewerId])

    // Show a spinner while the data is being fetched (데이터를 가져오는 동안 로딩 스피너를 표시합니다.)
    if (!data) {
        return (
            <div className="my-5 border border-dashed py-2 px-5 flex justify-center items-center h-40">
                <Spinner />
            </div>
        )
    }

    const { reviewer, product } = data

    return (
        <div className="flex my-5 py-2 px-5">
            {/* Reviewer Profile Image */}
            <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />

            <div className="ml-4 flex-1">
                {/* Reviewer Details */}
                <div className="flex justify-between">
                    <div>
                        <Text weight="bold">{reviewer.name}</Text>
                        <Text> reviewed </Text>
                    </div>
                    <Text color="lighterBlue">
                        {dayjs(createdAt).fromNow()}
                    </Text>
                </div>

                {/* Product Information */}
                <div>
                    <Link
                        href={`/products/${product.id}`}
                        className="border border-grey-300 px-2 py-1 my-3 inline-flex gap-2 items-center"
                    >
                        {/* Product title  */}
                        <Text size="sm" color="uclaBlue">
                            {product.title}
                        </Text>

                        {/* > */}
                        <Text size="sm" color="grey" weight="bold">
                            {'>'}
                        </Text>
                    </Link>

                    {/* User Review */}
                    <div>{contents}</div>
                </div>
            </div>
        </div>
    )
}

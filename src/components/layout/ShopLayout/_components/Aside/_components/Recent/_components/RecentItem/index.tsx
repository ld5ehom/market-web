import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import Text from '@/components/common/Text'
import { removeRecentItemId } from '@/utils/localstorage'

type Props = {
    id: string
    title: string
    price: number
    imageUrl: string
}

/**
 * RecentItem Component
 * Displays a recent product item with hover effects and an option to remove it.
 * 최근 본 상품을 표시하며, 마우스 오버 시 삭제 옵션을 제공합니다.
 */
export default function RecentItem({ id, title, price, imageUrl }: Props) {
    // Hover state to toggle views (호버 상태를 통해 뷰를 전환)
    const [isHover, setIsHover] = useState(false)

    return (
        <div
            onMouseEnter={() => setIsHover(true)} // Show detailed view on hover (호버 시 상세 뷰 표시)
            onMouseLeave={() => setIsHover(false)} // Revert to thumbnail view (썸네일 뷰로 복원)
        >
            <Link href={`/products/${id}`}>
                {/* Default view: Thumbnail image (기본 뷰: 썸네일 이미지) */}
                {!isHover ? (
                    <div className="w-16 h-16 border border-lightestBlue relative">
                        <Image
                            src={imageUrl}
                            alt={title}
                            layout="fill" // Fill parent container (부모 컨테이너를 채움)
                            className="object-cover" // Maintain aspect ratio and cover the area (비율을 유지하며 영역을 채움)
                        />
                    </div>
                ) : (
                    // Hover view: Display product details and remove button (호버 뷰: 상품 정보 및 삭제 버튼 표시)
                    <div className="w-16 h-16 relative">
                        <div className="absolute top-0 right-0 h-16 w-52 bg-white flex">
                            {/* Remove button */}
                            <div
                                className="absolute bg-uclaBlue flex justify-center items-center text-white cursor-pointer"
                                style={{ width: 20, height: 20, left: -20 }}
                                // Remove item from recent list (최근 본 상품에서 제거)
                                onClick={(e) => {
                                    e.preventDefault()
                                    removeRecentItemId(id)
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '1rem' }}
                                >
                                    close
                                </span>
                            </div>

                            {/* Product details (상품 정보) */}
                            <div className="flex-1 overflow-hidden px-2 flex flex-col justify-center gap-2 border-uclaBlue border-t border-l border-b">
                                <Text size="xs" className="truncate">
                                    {title}
                                </Text>
                                {/* Format price in USD (가격을 USD로 포맷) */}
                                <Text size="sm">{price.toFixed(2)} $ </Text>
                            </div>

                            {/* Product thumbnail (상품 썸네일) */}
                            <div className="w-16 h-16 shrink-0 border-t border-b border-r border-uclaBlue relative">
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    layout="fill" // Fill parent container (부모 컨테이너를 채움)
                                    className="object-cover" // Maintain aspect ratio and cover the area (비율을 유지하며 영역을 채움)
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Link>
        </div>
    )
}

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import { useEffect, useState } from 'react'
import ShopProfileImage from '@/components/common/ShopProfileImage'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getShop } from '@/repository/shops/getShop'
import { Shop } from '@/types'

type Props = {
    contents: string // Review contents (리뷰 내용)
    createdBy: string // ID of the shop that created the review (리뷰를 작성한 상점 ID)
    createdAt: string // Timestamp of when the review was created (리뷰가 작성된 시간)
}

// Extend dayjs with the relativeTime plugin and set the locale to English (US)
// dayjs에 relativeTime 플러그인을 추가하고 로케일을 미국 영어로 설정
dayjs.extend(relativeTime).locale('en')

// Main component for displaying a review item
// 리뷰 아이템을 표시하는 메인 컴포넌트
export default function ReviewItem({ contents, createdAt, createdBy }: Props) {
    const [reviewer, setReviewer] = useState<Shop>() // State to hold the reviewer's shop data (리뷰 작성자의 상점 데이터를 저장하는 상태)

    // Fetch the shop data for the reviewer when the component mounts
    // 컴포넌트가 마운트될 때 리뷰 작성자의 상점 데이터를 가져옴
    useEffect(() => {
        ;(async () => {
            const { data } = await getShop(createdBy) // Fetch the shop data (상점 데이터를 가져옴)
            setReviewer(data) // Set the reviewer data in state (리뷰어 데이터를 상태에 설정)
        })()
    }, [createdBy])

    // If the reviewer data is not yet loaded, display a loading spinner
    // 리뷰어 데이터가 아직 로드되지 않은 경우 로딩 스피너를 표시
    if (!reviewer) {
        return (
            <div className="flex my-2 py-2">
                <div className="flex justify-center items-center w-full h-32 border border-dashed">
                    <Spinner />
                </div>
            </div>
        )
    }

    // Render the review item with reviewer information
    // 리뷰어 정보를 포함한 리뷰 아이템을 렌더링
    return (
        <div className="flex my-2 py-2">
            <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />{' '}
            {/* Shop profile image (상점 프로필 이미지) */}
            <div className="ml-4 border-b pb-2 flex-1 w-0">
                <div className="flex justify-between">
                    <div className="truncate pr-1">
                        <Text color="grey" size="sm">
                            {/* Reviewer's shop name (리뷰어의 상점 이름) */}
                            {reviewer.name}{' '}
                        </Text>
                    </div>
                    <div className="shrink-0">
                        <Text color="grey" size="sm">
                            {/* Relative time of review creation in US format (미국 형식으로 리뷰 작성 시간 상대적 표시) */}
                            {dayjs(createdAt).fromNow()}{' '}
                        </Text>
                    </div>
                </div>
                <div className="py-2">
                    {/* Review contents (리뷰 내용) */}
                    {contents}
                </div>
            </div>
        </div>
    )
}

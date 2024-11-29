import { Like } from '@/types'
import { getMockLikeData } from '@/utils/mock'
import { getShopLikeCount } from '../likes/getShopLikeCount'

type Params = {
    shopId: string
    fromPage?: number
    toPage?: number
}

// Like Cart page
export async function getShopLikes({
    shopId,
}: Params): Promise<{ data: Like[] }> {
    // Fetch the total number of likes dynamically
    // 전체 찜 개수를 동적으로 가져옴
    const { data: totalLikes } = await getShopLikeCount(shopId)

    // Generate the number of likes based on the total count
    // 총 개수에 따라 찜 데이터를 생성
    const data: Like[] = Array.from({ length: totalLikes }).map(() =>
        getMockLikeData({ createdBy: shopId }),
    )

    return Promise.resolve({ data })
}

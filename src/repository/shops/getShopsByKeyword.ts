import { faker } from '@faker-js/faker'

import { Shop } from '@/types'
import { getMockShopData } from '@/utils/mock'

// Type definition for function parameters 함수 매개변수에 대한 타입 정의
type Params = {
    query: string // The search query keyword
    fromPage?: number // Starting page (optional, default is 0) (시작 페이지, 선택적, 기본값은 0)
    toPage?: number // Ending page (optional, default is 1) (끝 페이지, 선택적, 기본값은 1)
}

// Function to generate mock shop data based on the search keyword
// 검색어를 기반으로 모의 상점 데이터를 생성하는 함수
export async function getShopsByKeyword({
    query,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Shop[] }> {
    // Create an array of mock shop data, with 10 shops per page
    // 페이지당 20개의 상점을 포함하는 모의 상점 데이터 배열 생성
    const data: Shop[] = Array.from({ length: (toPage - fromPage) * 10 }).map(
        () =>
            getMockShopData({
                // Generate a shop name with the query appended (쿼리가 추가된 상점 이름을 생성)
                name: `${query} - ${faker.internet.displayName()}`,
            }),
    )

    // Return the mock data as a resolved promise
    return Promise.resolve({ data })
}

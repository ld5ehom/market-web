import { faker } from '@faker-js/faker'
import { Product } from '@/types'
import { getMockProductData } from '@/utils/mock'

// Define the type for function parameters   함수 매개변수에 대한 타입 정의
type Params = {
    query: string // The search query keyword  검색어 키워드
    fromPage?: number // The starting page (optional, default is 0)  시작 페이지 (선택적, 기본값은 0)
    toPage?: number // The ending page (optional, default is 1)  끝 페이지 (선택적, 기본값은 1)
}

// Function to generate mock product data based on the search keyword
// 검색 키워드를 기반으로 모의 상품 데이터를 생성하는 함수
export async function getProductsByKeyword({
    query,
    fromPage = 0,
    toPage = 1,
}: Params): Promise<{ data: Product[] }> {
    // Create an array of mock product data with length based on the page range
    // 페이지 범위를 기반으로 길이가 지정된 모의 상품 데이터 배열 생성
    const data: Product[] = Array.from({
        length: (toPage - fromPage) * 10,
    }).map(() =>
        getMockProductData({
            // Append the query to a generated product name
            title: `${query} - ${faker.commerce.productName()}`,
        }),
    )

    // Return the mock data as a resolved promise 모의 데이터를 해결된 프로미스로 반환
    return Promise.resolve({ data })
}

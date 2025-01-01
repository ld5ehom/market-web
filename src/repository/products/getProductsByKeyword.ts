import { SupabaseClient } from '@supabase/supabase-js'
import camelcaseKeys from 'camelcase-keys'
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
export async function getProductsByKeyword(
    supabase: SupabaseClient,
    { query, fromPage = 0, toPage = 1 }: Params,
): Promise<{ data: Product[] }> {
    if (process.env.USE_MOCK_DATA === 'true') {
        const { getMockProductData } = await import('@/utils/mock')
        const data: Product[] = Array.from({
            length: (toPage - fromPage) * 10,
        }).map((_, index) =>
            getMockProductData({
                title: `${query} - ${index}`,
            }),
        )

        return { data }
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .like('title', `%${query}%`)
        .is('purchase_by', null)
        .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    // Return the mock data as a resolved promise 모의 데이터를 해결된 프로미스로 반환
    return { data: camelcaseKeys(data, { deep: true }) }
}

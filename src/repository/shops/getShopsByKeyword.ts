import { faker } from '@faker-js/faker'
import { SupabaseClient } from '@supabase/supabase-js'
import camelcaseKeys from 'camelcase-keys'
import { Shop } from '@/types'

// Type definition for function parameters 함수 매개변수에 대한 타입 정의
type Params = {
    query: string // The search query keyword
    fromPage?: number // Starting page (optional, default is 0) (시작 페이지, 선택적, 기본값은 0)
    toPage?: number // Ending page (optional, default is 1) (끝 페이지, 선택적, 기본값은 1)
}

// Function to generate mock shop data based on the search keyword
// 검색어를 기반으로 모의 상점 데이터를 생성하는 함수
export async function getShopsByKeyword(
    supabase: SupabaseClient,
    { query, fromPage = 0, toPage = 1 }: Params,
): Promise<{ data: Shop[] }> {
    // Mock data
    if (process.env.USE_MOCK_DATA === 'true') {
        const { getMockShopData } = await import('@/utils/mock')
        const data: Shop[] = Array.from({
            length: (toPage - fromPage) * 10,
        }).map((_, idx) =>
            getMockShopData({
                name: `${query} - ${idx}`,
            }),
        )
        return { data }
    }
    const { data, error } = await supabase
        .from('shops')
        .select('*')
        .like('name', `%${query}%`)
    if (error) {
        throw error
    }

    // Return the mock data as a resolved promise
    return { data: camelcaseKeys(data, { deep: true }) }
}

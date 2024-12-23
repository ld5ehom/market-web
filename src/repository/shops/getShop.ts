import { SupabaseClient } from '@supabase/supabase-js'
import camelcaseKeys from 'camelcase-keys'
import { Shop } from '@/types'
// import { getMockShopData } from '@/utils/mock'

// export async function getShop(shopId: string): Promise<{
//     data: Shop
// }> {
//     const data: Shop = getMockShopData({ id: shopId })

//     return Promise.resolve({ data })
// }

export async function getShop(
    supabase: SupabaseClient,
    shopId: string,
): Promise<{
    data: Shop
}> {
    if (process.env.USE_MOCK_DATA === 'true') {
        const { getMockShopData } = await import('@/utils/mock')
        const data: Shop = getMockShopData({ id: shopId })
        return { data }
    }

    const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .limit(1)
        .single()

    if (error) {
        throw error
    }

    return {
        data: camelcaseKeys(data),
    }
}

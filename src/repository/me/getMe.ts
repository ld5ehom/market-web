import supabase from '@/utils/supabase'

export async function getMe(): Promise<{ data: { shopId: string | null } }> {
    // return Promise.resolve({ data: { shopId: 'mock-shop-id' } })

    // null = need to login
    // return Promise.resolve({ data: { shopId: null } })

    if (process.env.USE_MOCK_DATA === 'true') {
        return Promise.resolve({ data: { shopId: 'mock-shop-id' } })
    }
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return { data: { shopId: user?.id || null } }
}

import { SupabaseClient } from '@supabase/supabase-js'

// Supabase delete product
export async function deleteProduct(
    supabase: SupabaseClient,
    productId: string,
) {
    // Mock data
    if (process.env.USE_MOCK_DATA === 'true') {
        return
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    if (error) {
        throw error
    }

    return
}

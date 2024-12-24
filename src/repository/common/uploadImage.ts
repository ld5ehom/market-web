import { SupabaseClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
import { getImageUrl } from '@/utils/image'

export async function uploadImage(
    supabase: SupabaseClient,
    imageFile: File,
): Promise<{ data: { imageUrl: string } }> {
    // Mock image
    if (process.env.USE_MOCK_DATA === 'true') {
        const { getMockImageDataUri } = await import('@/utils/mock')
        return { data: { imageUrl: getMockImageDataUri() } }
    }

    // Supabase Storage market image (jpeg, png)
    const { data, error } = await supabase.storage
        .from('market')
        .upload(
            `${nanoid()}.${imageFile.type === 'image/jpeg' ? 'jpeg' : 'png'}`,
            imageFile,
        )

    if (error) {
        throw error
    }

    const imageUrl = await getImageUrl(data.path)

    return { data: { imageUrl } }
}

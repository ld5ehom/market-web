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

    // File format check (only jpeg and png are allowed)
    const fileExtension =
        imageFile.type === 'image/jpeg'
            ? 'jpeg'
            : imageFile.type === 'image/png'
              ? 'png'
              : null

    if (!fileExtension) {
        throw new Error('Invalid image format. Only jpeg and png are allowed.')
    }

    try {
        // Supabase Storage upload
        const { data, error } = await supabase.storage
            .from('market')
            .upload(`${nanoid()}.${fileExtension}`, imageFile)

        // Handle upload error
        if (error) {
            throw error
        }

        // Generate image URL
        const imageUrl = await getImageUrl(data.path)

        return { data: { imageUrl } }
    } catch (error) {
        console.error('Image upload failed:', error)
        throw new Error('Failed to upload image. Please try again.')
    }
}

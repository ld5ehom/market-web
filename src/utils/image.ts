import supabase from './supabase/browserSupabase'

export function checkIsImage(str: string) {
    return /^data:image/.test(str) || /^https:\/\//.test(str)
}

export async function getImageUrl(fileName: string) {
    // Full image URL
    if (fileName.startsWith('http')) {
        return fileName
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from('market').getPublicUrl(fileName)

    return publicUrl
}

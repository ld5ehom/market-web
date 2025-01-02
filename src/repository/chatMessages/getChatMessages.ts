import { SupabaseClient } from '@supabase/supabase-js'
import camelcaseKeys from 'camelcase-keys'
import { ChatMessage } from '@/types'

type Params = {
    chatRoomId: string // The ID of the chat room to fetch messages for (채팅방의 메시지를 가져오기 위한 ID)
    fromIndex?: number // The starting index for fetching messages (메시지를 가져올 시작 인덱스)
    toIndex?: number // The ending index for fetching messages (메시지를 가져올 끝 인덱스)
}

// Fetches chat messages based on chatRoomId and range indices (chatRoomId와 범위 인덱스를 기반으로 채팅 메시지 가져오기)
export async function getChatMessages(
    supabase: SupabaseClient,
    { chatRoomId, fromIndex = 0, toIndex = 1 }: Params,
): Promise<{
    data: ChatMessage[]
}> {
    // Generates mock chat messages for the specified range
    if (process.env.USE_MOCK_DATA === 'true') {
        const { getMockChatMessageData } = await import('@/utils/mock')
        const data: ChatMessage[] = Array.from({
            length: toIndex - fromIndex,
        }).map((_, idx) =>
            getMockChatMessageData({
                chatRoom: chatRoomId,
                message: `fromIndex: ${fromIndex}, toIndex: ${toIndex}, curIndex: ${idx}`,
            }),
        )
        return { data }
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_room', chatRoomId)
        .range(fromIndex, toIndex)
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return { data: camelcaseKeys(data) }
}

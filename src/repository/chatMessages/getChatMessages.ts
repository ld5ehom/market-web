import { ChatMessage } from '@/types'
import { getMockChatMessageData } from '@/utils/mock'

type Params = {
    chatRoomId: string // The ID of the chat room to fetch messages for (채팅방의 메시지를 가져오기 위한 ID)
    fromIndex?: number // The starting index for fetching messages (메시지를 가져올 시작 인덱스)
    toIndex?: number // The ending index for fetching messages (메시지를 가져올 끝 인덱스)
}

// Fetches chat messages based on chatRoomId and range indices (chatRoomId와 범위 인덱스를 기반으로 채팅 메시지 가져오기)
export async function getChatMessages({
    chatRoomId,
    fromIndex = 0,
    toIndex = 1,
}: Params): Promise<{
    data: ChatMessage[]
}> {
    // Generates mock chat messages for the specified range (지정된 범위에 대한 가짜 채팅 메시지를 생성)
    const data: ChatMessage[] = Array.from({ length: toIndex - fromIndex }).map(
        () => getMockChatMessageData({ chatRoom: chatRoomId }),
    )

    // Resolves with the generated mock chat messages (생성된 가짜 채팅 메시지로 Promise 반환)
    return Promise.resolve({ data })
}

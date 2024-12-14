import classNames from 'classnames'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import { useEffect, useState } from 'react'
import Text from '@/components/common/Text'
import { getChatMessages } from '@/repository/chatMessages/getChatMessages'
import { ChatMessage } from '@/types'
import { checkIsImage } from '@/utils/image'

type Props = {
    chatRoomId: string // The ID of the chat room
    myShopId: string // The ID of the current user's shop
    counterShopId: string // The ID of the other shop in the chat
}

// Extend dayjs with the relativeTime plugin and set locale to English
dayjs.extend(relativeTime).locale('en')

export default function Messages({
    chatRoomId,
    myShopId,
    counterShopId,
}: Props) {
    const [messages, setMessage] = useState<ChatMessage[]>([]) // State to store chat messages

    useEffect(() => {
        // Fetch chat messages when the chat room changes
        ;(async () => {
            const { data } = await getChatMessages({
                chatRoomId,
                fromIndex: 0,
                toIndex: 10, // Fetch the first 10 messages
            })
            setMessage(data) // Update the state with the fetched messages
        })()
    }, [chatRoomId])

    return (
        <div className="flex-1 overflow-scroll">
            {/* Show a prompt if there are no messages */}
            {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <Text color="grey" size="lg">
                        No messages available
                    </Text>
                </div>
            ) : (
                /* Render each message */
                messages.map(({ id, message, createdBy, createdAt }) => {
                    const isMyMessage = createdBy === myShopId // Check if the message is sent by the current user
                    return (
                        <div key={id} className="flex flex-col">
                            <div
                                className={classNames(
                                    'flex flex-col m-2 px-2 py-1 w-72', // Common styling for messages (공통 메시지 스타일)
                                    isMyMessage
                                        ? 'self-end text-right border-r-2 border-slate-200' // Add a right border and align to the right for user's messages (사용자 메시지는 우측 정렬 및 우측 경계선 추가)
                                        : 'border-l-2 border-slate-200', // Add a left border for the counter shop's messages (상대방 메시지는 좌측 경계선 추가)
                                )}
                            >
                                {/* Check if the message is an image */}
                                <div
                                    className={classNames(
                                        'relative', // Positioning context for the image or text (이미지 또는 텍스트의 포지션 컨텍스트)
                                        checkIsImage(message)
                                            ? 'w-28 h-28'
                                            : '', // Apply fixed size for images (이미지의 고정 크기 적용)
                                    )}
                                >
                                    {checkIsImage(message) ? (
                                        <Image
                                            src={message} // The image URL from the message
                                            alt="Image message" // Alt text for accessibility
                                            fill // Makes the image fill its container
                                            className="object-cover" // Ensures proper aspect ratio without distortion
                                        />
                                    ) : (
                                        <Text size="sm">{message}</Text> // Render the message text
                                    )}
                                </div>

                                {/* Display relative time */}
                                <div>
                                    <Text color="grey" size="sm">
                                        {dayjs(createdAt).fromNow()}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

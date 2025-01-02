import camelcaseKeys from 'camelcase-keys'
import classNames from 'classnames'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import { useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import getChatMessageCount from '@/repository/chatMessages/getChatMessageCount'
import { getChatMessages } from '@/repository/chatMessages/getChatMessages'
import { ChatMessage } from '@/types'
import { checkIsImage } from '@/utils/image'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    chatRoomId: string // The ID of the chat room (채팅방 ID)
    myShopId: string // The ID of the current user's shop (현재 사용자의 상점 ID)
    counterShopId: string // The ID of the other shop in the chat (채팅 상대 상점 ID)
}

dayjs.extend(relativeTime).locale('ko') // Extend dayjs with relativeTime plugin and set locale to Korean (dayjs에 relativeTime 플러그인 확장 및 한국어 설정)

export default function Messages({
    chatRoomId,
    myShopId,
    counterShopId,
}: Props) {
    const virtuoso = useRef<VirtuosoHandle>(null) // Reference for Virtuoso instance (Virtuoso 인스턴스 참조)

    const [count, setCount] = useState<number>() // Total number of messages (전체 메시지 수)
    const [firstItemIndex, setFirstItemIndex] = useState<number>() // Index of the first item in the list (리스트의 첫 번째 항목 인덱스)
    const [messages, setMessage] = useState<ChatMessage[]>([]) // Chat messages state (채팅 메시지 상태)
    const [isLoading, setIsLoading] = useState(false) // Loading state for fetching previous messages (이전 메시지 가져오기 로딩 상태)
    const [hasNewMessage, setHasNewMessage] = useState(false) // Supabase Realtime on

    useEffect(() => {
        // Fetch initial messages and message count when the chat room changes (채팅방이 변경될 때 초기 메시지와 메시지 수 가져오기)
        ;(async () => {
            const [{ data: messages }, { data: count }] = await Promise.all([
                getChatMessages(supabase, {
                    chatRoomId,
                    fromIndex: 0,
                    toIndex: 10,
                }),
                getChatMessageCount(supabase, chatRoomId),
            ])
            setMessage([...messages.reverse()]) // Reverse messages for correct order (올바른 순서를 위해 메시지 반전)
            const firstItemIndex = count - messages.length
            setFirstItemIndex(firstItemIndex)
            setCount(count)

            // Scroll to the most recent message (가장 최근 메시지로 스크롤)
            virtuoso.current?.scrollToIndex({
                index: firstItemIndex,
                align: 'end',
            })
        })()
    }, [chatRoomId])

    // Supabase Realtime on
    useEffect(() => {
        const subscribeChat = supabase.channel(`chat_on_${chatRoomId}`).on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `chat_room=eq.${chatRoomId}`,
            },
            (payload) => {
                setMessage((prev) => [
                    ...prev,
                    camelcaseKeys(payload.new) as ChatMessage,
                ])
                setCount((prev = 0) => prev + 1)
                setHasNewMessage(true)
                setTimeout(() => {
                    setHasNewMessage(false)
                }, 3000)
            },
        )

        subscribeChat.subscribe()

        return () => {
            subscribeChat.unsubscribe()
        }
    }, [chatRoomId])

    const handleGetPrevMessage = async (index: number) => {
        // Fetch previous messages when reaching the top (상단에 도달할 때 이전 메시지 가져오기)
        if (count === undefined) return

        const fromIndex = count - index
        const toIndex = fromIndex + 10

        setIsLoading(true)

        const { data } = await getChatMessages(supabase, {
            chatRoomId,
            fromIndex,
            toIndex,
        })

        setMessage((prev) => [...data.reverse(), ...(prev || [])]) // Add previous messages at the beginning (이전 메시지를 앞에 추가)
        setFirstItemIndex(Math.max(count - toIndex, 0)) // Update the first item index (첫 번째 항목 인덱스 업데이트)
        setIsLoading(false)
    }

    return (
        <div className="flex-1 overflow-scroll relative">
            {/* Show loading spinner when fetching messages (메시지 가져오는 동안 로딩 스피너 표시) */}
            {isLoading && (
                <div className="absolute top-1 left-0 w-full z-50">
                    <div className="rounded bg-black text-center w-full m-auto opacity-50">
                        <Text color="white">
                            <Spinner />
                        </Text>
                    </div>
                </div>
            )}

            {/* Supabase Reatlime */}
            {hasNewMessage && (
                <div className="absolute bottom-1 left-0 w-full z-30">
                    <button
                        type="button"
                        className="rounded bg-black text-center w-full m-auto opacity-50"
                        onClick={() => {
                            virtuoso.current?.scrollToIndex({
                                index: messages.length - 1,
                                align: 'end',
                            })
                            setHasNewMessage(false)
                        }}
                    >
                        <Text color="grey"> See New Messages </Text>
                    </button>
                </div>
            )}

            {/* Show placeholder if there are no messages (메시지가 없는 경우 안내 메시지 표시) */}
            {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <Text color="grey" size="lg">
                        No messages available
                    </Text>
                </div>
            ) : (
                /* Render messages using Virtuoso (Virtuoso를 사용하여 메시지 렌더링) */
                <Virtuoso
                    ref={virtuoso}
                    firstItemIndex={firstItemIndex} // Index of the first item in the list (리스트의 첫 번째 항목 인덱스)
                    initialTopMostItemIndex={messages.length - 1} // Start at the last message (마지막 메시지에서 시작)
                    startReached={handleGetPrevMessage} // Triggered when reaching the top (상단에 도달 시 트리거)
                    data={messages}
                    itemContent={(_, { id, message, createdBy, createdAt }) => {
                        const isMyMessage = createdBy === myShopId // Check if the message is sent by the current user (메시지가 현재 사용자에 의해 전송된 것인지 확인)

                        return (
                            <div key={id} className="flex flex-col">
                                <div
                                    className={classNames(
                                        'flex flex-col m-2 px-2 py-1 w-72', // Common styling for messages (공통 메시지 스타일)
                                        isMyMessage &&
                                            'border-l-2 border-slate-200', // Add left border for user's messages (사용자 메시지에 좌측 경계선 추가)
                                        !isMyMessage &&
                                            'border-r-2 border-slate-200 self-end text-right', // Add right border and align right for other user's messages (상대방 메시지에 우측 경계선 및 우측 정렬 추가)
                                    )}
                                >
                                    <div>
                                        {/* Check if the message is an image (메시지가 이미지인지 확인) */}
                                        {checkIsImage(message) ? (
                                            <div className="relative w-28 h-28">
                                                <Image
                                                    src={message} // The image URL (이미지 URL)
                                                    alt="Image message"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <Text size="sm">{message}</Text> // Render text message (텍스트 메시지 렌더링)
                                        )}
                                    </div>
                                    <div>
                                        <Text color="grey" size="sm">
                                            {dayjs(createdAt).fromNow()}{' '}
                                            {/* Display relative time (상대 시간 표시) */}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                />
            )}
        </div>
    )
}

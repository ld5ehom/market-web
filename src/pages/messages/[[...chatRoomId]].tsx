import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ChatMessages from './_components/ChatMessages'
import ChatPreview from './_components/ChatPreview'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import Wrapper from '@/components/layout/Wrapper'
import { getChatRooms } from '@/repository/chatRooms/getChatRooms'
import { getMe } from '@/repository/me/getMe'
import { ChatRoom } from '@/types'
import { AuthError } from '@/utils/error'
import supabase from '@/utils/supabase/browserSupabase'
import getServerSupabase from '@/utils/supabase/getServerSupabase'

// Fetches chat room data and shop ID during server-side rendering
// (서버사이드 렌더링 중 채팅방 데이터와 상점 ID를 가져옴)
export const getServerSideProps: GetServerSideProps<{
    chatRooms: ChatRoom[] // List of chat rooms for the shop (상점의 채팅방 목록)
    shopId: string // The ID of the shop (상점 ID)
}> = async (context) => {
    const supabase = getServerSupabase(context)

    try {
        // Fetch user information to retrieve the shop ID (사용자 정보를 가져와 상점 ID 확인)
        const {
            data: { shopId },
        } = await getMe(supabase)

        // If the shop ID is missing, throw an authentication error (상점 ID가 없으면 인증 오류 발생)
        if (!shopId) {
            throw new AuthError()
        }

        // Fetch chat rooms for the shop using the shop ID (상점 ID를 사용해 채팅방 데이터를 가져옴)
        const { data: chatRooms } = await getChatRooms(supabase, shopId)

        // Return the chat room data and shop ID as props (채팅방 데이터와 상점 ID를 props로 반환)
        return {
            props: { chatRooms, shopId },
        }
    } catch (e) {
        // Handle authentication errors by redirecting to the login page
        // (인증 오류 발생 시 로그인 페이지로 리디렉션 처리)
        if (e instanceof AuthError) {
            return {
                redirect: {
                    destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`, // Append the current URL as a query parameter (현재 URL을 쿼리 파라미터로 추가)
                    permanent: false, // Temporary redirect (임시 리디렉션)
                },
            }
        }

        // Rethrow other errors to be handled by Next.js (다른 오류는 Next.js가 처리하도록 다시 던짐)
        throw e
    }
}

export default function Messages({
    chatRooms: initialChatRooms,
    shopId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [chatRooms, setChatRooms] = useState(initialChatRooms)
    const currentChatRoomId = router.query.chatRoomId?.[0]
    const currentChatRoom = chatRooms.find(({ id }) => id === currentChatRoomId)

    // Supabase realtime on
    const handleUpdateChatRooms = useCallback(async () => {
        const { data } = await getChatRooms(supabase, shopId)
        setChatRooms(data)
    }, [shopId])
    useEffect(() => {
        const subscribeChatRoomsFromMe = supabase
            .channel(`chat_rooms_from_${shopId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_rooms',
                    filter: `from_shop_id=eq.${shopId}`,
                },
                () => handleUpdateChatRooms(),
            )
        const subscribeChatRoomsToMe = supabase
            .channel(`chat_rooms_to_${shopId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_rooms',
                    filter: `to_shop_id=eq.${shopId}`,
                },
                () => handleUpdateChatRooms(),
            )
        subscribeChatRoomsFromMe.subscribe()
        subscribeChatRoomsToMe.subscribe()
        return () => {
            subscribeChatRoomsFromMe.unsubscribe()
            subscribeChatRoomsToMe.unsubscribe()
        }
    }, [handleUpdateChatRooms, shopId])

    return (
        <Wrapper className="bg-lightestBlue">
            <Container>
                {/* Main chat layout with sidebar and chat panel (사이드바와 채팅 패널을 포함한 주요 채팅 레이아웃) */}
                <div className="flex bg-white border-x border-lighterBlue">
                    {/* Sidebar displaying list of chat rooms (채팅방 목록을 표시하는 사이드바) */}
                    <div
                        className="w-1/2 h-full flex overflow-scroll"
                        style={{
                            minHeight: 'calc(100vh - 28px - 108px - 65px)', // Ensures consistent sidebar height (일관된 사이드바 높이 설정)
                            maxHeight: 'calc(100vh - 28px - 108px - 65px)',
                        }}
                    >
                        {/* Displays a message if no chat rooms exist (채팅방이 없는 경우 메시지를 표시) */}
                        {chatRooms.length === 0 ? (
                            <div className="flex justify-center items-center flex-1">
                                <Text color="lighterBlue" size="2xl">
                                    No chat rooms available{' '}
                                </Text>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1">
                                {/* Renders a list of chat room previews (채팅방 미리보기를 렌더링) */}
                                <Virtuoso
                                    initialTopMostItemIndex={Math.max(
                                        chatRooms.findIndex(
                                            ({ id }) =>
                                                id === currentChatRoomId,
                                        ),
                                        0,
                                    )}
                                    data={chatRooms}
                                    itemContent={(
                                        _,
                                        { id, fromShopId, toShopId },
                                    ) => (
                                        <ChatPreview
                                            key={id}
                                            chatRoomId={id}
                                            shopId={
                                                fromShopId === shopId
                                                    ? toShopId
                                                    : fromShopId
                                            }
                                            isActive={currentChatRoomId === id}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Chat panel for displaying selected chat content (선택한 채팅 내용을 표시하는 채팅 패널) */}
                    <div
                        className="w-1/2 border-l border-grey px-2"
                        style={{
                            minHeight: 'calc(100vh - 28px - 108px - 65px)', // Set the minimum height by subtracting specific element heights from the viewport height
                            maxHeight: 'calc(100vh - 28px - 108px - 65px)', // Set the maximum height using the same calculation
                        }}
                    >
                        {/* Display a message when no chat room is selected */}
                        {!currentChatRoom ? (
                            <div className="flex justify-center items-center h-full">
                                <Text color="grey">Please select a chat</Text>{' '}
                            </div>
                        ) : (
                            <ChatMessages
                                chatRoomId={currentChatRoom.id}
                                myShopId={shopId}
                                counterShopId={
                                    currentChatRoom.fromShopId === shopId
                                        ? currentChatRoom.toShopId
                                        : currentChatRoom.fromShopId
                                }
                            />
                        )}
                    </div>
                </div>
            </Container>
        </Wrapper>
    )
}

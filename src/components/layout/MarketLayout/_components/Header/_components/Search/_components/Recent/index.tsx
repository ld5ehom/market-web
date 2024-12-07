import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import Text from '@/components/common/Text'
import {
    RECENT_KEYWORDS_KEY,
    addRecentKeyword,
    clearRecentKeyword,
    getRecentKeywords,
} from '@/utils/localstorage'

/*
 * Recent Searches Bar (최근 검색어 창)
 */

// Props type for the Recent component (Recent 컴포넌트의 Props 타입)
type Props = {
    handleClose: () => void // Function to handle closing the component (컴포넌트를 닫는 함수)
}

export default function Recent({ handleClose }: Props) {
    // Array to Marketplace recent search terms (최근 검색어를 저장하는 배열)
    const [recents, setRecents] = useState<string[]>([])

    const handleSetRecents = useCallback(() => {
        // Fetch recent search keywords
        // 컴포넌트가 마운트될 때 최근 검색어를 가져옴
        const recents = getRecentKeywords()
        setRecents(recents)
    }, [])

    // Trigger the handleSetRecents function when the component mounts or when handleSetRecents changes
    // 컴포넌트가 마운트되거나 handleSetRecents가 변경될 때 handleSetRecents 함수 호출
    useEffect(() => {
        handleSetRecents()
    }, [handleSetRecents])

    useEffect(() => {
        // Define an event handler to trigger handleSetRecents when the event RECENT_KEYWORDS_KEY is dispatched
        // RECENT_KEYWORDS_KEY 이벤트가 발생할 때 handleSetRecents를 호출하는 이벤트 핸들러 정의
        const eventHandler = () => handleSetRecents()

        // Add an event listener for RECENT_KEYWORDS_KEY when the component mounts
        // 컴포넌트가 마운트되었을 때 RECENT_KEYWORDS_KEY에 대한 이벤트 리스너 추가
        window.addEventListener(RECENT_KEYWORDS_KEY, eventHandler)

        return () =>
            // Clean up: Remove the event listener when the component unmounts or when dependencies change
            // 정리: 컴포넌트가 언마운트되거나 의존성이 변경될 때 이벤트 리스너 제거
            window.removeEventListener(RECENT_KEYWORDS_KEY, eventHandler)
    }, [handleSetRecents])

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                <div className="border-b border-uclaBlue pb-1 mb-2">
                    <Text size="sm" color="uclaBlue" weight="bold">
                        Recent Searches
                    </Text>
                </div>

                {recents.length === 0 ? (
                    // If there are no recent searches, display a message
                    // 최근 검색어가 없을 경우 메시지를 표시
                    <div className="h-full flex justify-center items-center">
                        <Text color="grey" size="sm">
                            No recent searches
                        </Text>
                    </div>
                ) : (
                    // If there are recent searches, display them in a scrollable container
                    // 최근 검색어가 있을 경우 스크롤 가능한 컨테이너에 표시
                    <div className="h-full overflow-scroll pb-8">
                        {recents.map((recent) => (
                            <Link
                                href={`/search?query=${encodeURIComponent(recent)}`}
                                key={recent}
                                className="block my-1 truncate cursor-pointer"
                                prefetch={false}
                                onClick={() => {
                                    addRecentKeyword(recent)
                                    handleClose()
                                }}
                            >
                                <Text
                                    size="sm"
                                    key={recent}
                                    className="block my-1 truncate"
                                >
                                    {recent}
                                </Text>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with 'Clear All' and 'Close' buttons */}
            <div className="bg-gray-100 flex justify-between items-center h-8 px-2">
                {/* Button to clear all recent searches */}
                <Text
                    size="sm"
                    onClick={clearRecentKeyword}
                    className="cursor-pointer"
                >
                    Clear All Searches
                </Text>

                <Text
                    size="sm"
                    onClick={handleClose}
                    className="cursor-pointer"
                >
                    Close
                </Text>
            </div>
        </div>
    )
}

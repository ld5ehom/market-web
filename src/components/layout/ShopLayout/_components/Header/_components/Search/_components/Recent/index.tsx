import { useState, useEffect } from 'react'

import Text from '@/components/common/Text'
import { getRecentKeywords, clearRecentKeyword } from '@/utils/localstorage'

// Props type for the Recent component
// Recent 컴포넌트의 Props 타입 정의
type Props = {
    handleClose: () => void // Function to handle closing the component
    // 컴포넌트를 닫는 함수를 정의
}

export default function Recent({ handleClose }: Props) {
    // Array to store recent search terms
    // 최근 검색어를 저장하는 배열
    const [recents, setRecents] = useState<string[]>([])

    useEffect(() => {
        // Fetch recent search keywords from local storage when the component mounts
        // 컴포넌트가 마운트될 때 로컬 스토리지에서 최근 검색어를 가져옴
        const recents = getRecentKeywords()
        setRecents(recents)
    }, [])

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
                        {recents.map((recent, idx) => (
                            <Text
                                size="sm"
                                key={idx}
                                className="block my-1 truncate"
                            >
                                {recent}
                            </Text>
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

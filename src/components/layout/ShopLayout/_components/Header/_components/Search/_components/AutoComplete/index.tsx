import { throttle } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import Text from '@/components/common/Text'
import { getProductsByKeyword } from '@/repository/products/getProductsByKeyword'
import { addRecentKeyword } from '@/utils/localstorage'

// Props type for the AutoComplete component (AutoComplete 컴포넌트의 Props 타입 정의)
type Props = {
    query: string // The search query entered by the user (사용자가 입력한 검색어)
    handleClose: () => void // Function to handle closing the component (컴포넌트를 닫는 함수를 정의)
}

export default function AutoComplete({ query, handleClose }: Props) {
    // Use the Next.js router to handle page navigation
    // Next.js 라우터를 사용하여 페이지 이동을 처리
    const router = useRouter()

    // State to store autocomplete keywords (자동 완성 키워드를 저장하는 상태)
    const [keywords, setKeywords] = useState<string[]>([])

    // lodash throttle
    const handleSearch = useMemo(
        () =>
            throttle(async (query: string) => {
                if (!query) {
                    setKeywords([])
                    return
                }
                const { data } = await getProductsByKeyword({
                    query,
                    fromPage: 0,
                    toPage: 2,
                })
                setKeywords(data.map(({ title }) => title))
            }, 500),
        [],
    )

    // Effect to fetch keywords based on the query (검색어에 따라 키워드를 가져오는 효과)
    useEffect(() => {
        handleSearch(query)
    }, [handleSearch, query]) // lodash

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 overflow-hidden flex-1">
                {/* Header section for store search */}
                <div className="border-b border-grey-300 pb-1 mb-2 flex items-center">
                    <span className="material-symbols-outlined shrink-0">
                        storefront
                    </span>

                    <Text size="sm" className="ml-1 shrink-0">
                        Store Search {'>'}
                    </Text>

                    <Text
                        size="sm"
                        color="darkestBlue"
                        className="mx-1 truncate"
                    >
                        {query} {/* Display the search query */}
                    </Text>

                    <Text size="sm" color="lighterBlue" className="shrink-0">
                        Search by store
                    </Text>
                </div>

                {keywords.length === 0 ? (
                    // If there are no autocomplete keywords, show a message
                    // 자동 완성 키워드가 없을 경우 메시지를 표시
                    <div className="h-full flex justify-center items-center">
                        <Text color="lighterBlue" size="sm">
                            No recommended keywords
                        </Text>
                    </div>
                ) : (
                    // If there are autocomplete keywords, display them in a scrollable container
                    // 자동 완성 키워드가 있을 경우 스크롤 가능한 컨테이너에 표시
                    <div className="h-full overflow-scroll pb-8">
                        {keywords.map((keyword) => (
                            <Text
                                size="sm"
                                key={keyword}
                                className="block my-1 truncate cursor-pointer"
                                onClick={() => {
                                    addRecentKeyword(keyword)
                                    router.push(
                                        `/search?query=${encodeURIComponent(keyword)}`,
                                    )
                                }}
                            >
                                {keyword}
                            </Text>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer section with a close button */}
            <div className="bg-gray-100 flex justify-end items-center h-8 px-2">
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

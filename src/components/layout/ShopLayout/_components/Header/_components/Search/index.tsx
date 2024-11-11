import classNames from 'classnames'
import { useState } from 'react'

import AutoComplete from './_components/AutoComplete'
import Recent from './_components/Recent'

// Search Bar Component
export default function Search() {
    // State to store search input and manage focus
    // 검색 입력을 저장하고 포커스를 관리하는 상태
    const [search, setSearch] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="relative">
            {/* Search input container with styling */}
            {/* 스타일이 적용된 검색 입력 컨테이너 */}
            <div className="w-[450px] border-2 border-uclaBlue px-4 py-2 rounded-lg">
                <form className="flex justify-between">
                    {/* Search input field */}
                    {/* 검색 입력 필드 */}
                    <input
                        className="w-full text-sm font-light outline-0 bg-lightestBlue px-2"
                        type="text"
                        placeholder="Enter product or store name" // Placeholder for search input
                        value={search}
                        onFocus={() => setIsFocused(true)}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* Search button */}
                    {/* 검색 버튼 */}
                    <button className="flex justify-center items-center">
                        <span className="material-symbols-outlined">
                            search
                        </span>
                    </button>
                </form>
            </div>

            {/* Dropdown container for search suggestions */}
            {/* 검색 제안 목록을 위한 드롭다운 컨테이너 */}
            <div
                className={classNames(
                    'absolute w-full bg-white border border-grey-300 mt-2 h-96',
                    { hidden: !isFocused },
                )}
            >
                {search ? (
                    // AutoComplete component when there is a search query
                    // 검색어가 있을 때 AutoComplete 컴포넌트
                    <AutoComplete
                        query={search}
                        handleClose={() => setIsFocused(false)}
                    />
                ) : (
                    // Recent searches component when no search query
                    // 검색어가 없을 때 최근 검색 기록 컴포넌트
                    <Recent handleClose={() => setIsFocused(false)} />
                )}
            </div>
        </div>
    )
}

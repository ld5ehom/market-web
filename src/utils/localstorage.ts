const RECENT_KEYWORDS_KEY = 'recent_keywords_[]'

// Helper function to get an array from localStorage
// localStorage에서 배열을 가져오는 도우미 함수
const getArray = (key: string) => {
    try {
        const items = localStorage.getItem(key)
        if (items) {
            return JSON.parse(items)
        }
        // Return an empty array if there are no items (항목이 없으면 빈 배열을 반환)
        return []
    } catch {
        // Return an empty array in case of error (오류가 발생한 경우 빈 배열을 반환)
        return []
    }
}

// Helper function to set an array in localStorage
// localStorage에 배열을 설정하는 도우미 함수
const setArray = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value))
}

// Function to get recent keywords from localStorage
// localStorage에서 최근 검색어를 가져오는 함수
export const getRecentKeywords = (): string[] => getArray(RECENT_KEYWORDS_KEY)

// Function to add a keyword to the recent keywords list
// 최근 검색어 목록에 키워드를 추가하는 함수
export const addRecentKeyword = (keyword: string) => {
    const items = getRecentKeywords()
    const existItem = items.find((item) => item === keyword)

    if (existItem) {
        // If the keyword already exists, remove it and add it to the front
        // 키워드가 이미 있으면 제거하고 앞에 추가
        const prevItems = items.filter((item) => item !== keyword)
        setArray(RECENT_KEYWORDS_KEY, [keyword, ...prevItems])
    } else {
        // If the keyword does not exist, add it to the front of the list
        // 키워드가 없으면 목록의 앞에 추가
        setArray(RECENT_KEYWORDS_KEY, [keyword, ...items])
    }
}

// Function to clear all recent keywords from localStorage
// localStorage에서 모든 최근 검색어를 제거하는 함수
export const clearRecentKeyword = () => {
    localStorage.removeItem(RECENT_KEYWORDS_KEY)
}

export const RECENT_ITEM_IDS_KEY = 'recent_item_ids_[]'
export const RECENT_KEYWORDS_KEY = 'recent_keywords_[]'

// Helper function to get an array from localStorage
// localStorage에서 배열을 가져오는 도우미 함수
type ArrayKeys = typeof RECENT_ITEM_IDS_KEY | typeof RECENT_KEYWORDS_KEY

const getArray = (key: ArrayKeys) => {
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
const setArray = (key: ArrayKeys, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(key))
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

// Function to clear all recent keywords
// 모든 최근 검색어를 제거하는 함수
export const clearRecentKeyword = () => {
    setArray(RECENT_KEYWORDS_KEY, [])
}

// Retrieves the list of recent item IDs from localStorage
// localStorage에서 최근 항목 ID 목록을 가져옵니다.
export const getRecentItemIds = (): string[] => getArray(RECENT_ITEM_IDS_KEY)

/**
 * Adds a product ID to the list of recent items in localStorage.
 * If the product already exists, it moves the product to the front of the list.
 * If the product does not exist, it adds the product ID to the beginning of the list.
 * localStorage에 최근 항목 목록에 제품 ID를 추가합니다.
 * 제품이 이미 존재하면 해당 제품을 목록의 맨 앞으로 이동합니다.
 * 제품이 존재하지 않으면 제품 ID를 목록의 맨 앞에 추가합니다.
 */
export const addRecentItemId = (productId: string) => {
    const items = getRecentItemIds() // Get the current list of recent item IDs
    const existItem = items.find((item) => item === productId) // Check if the product already exists

    if (existItem) {
        // If the product exists, move it to the front
        // 제품이 이미 존재하는 경우, 목록의 맨 앞으로 이동
        const prevItems = items.filter((item) => item !== productId) // Remove the existing product ID from the list
        setArray(RECENT_ITEM_IDS_KEY, [productId, ...prevItems]) // Add the product ID to the front of the list
    } else {
        // If the product does not exist, add it to the front
        // 제품이 존재하지 않는 경우, 목록의 맨 앞에 추가
        setArray(RECENT_ITEM_IDS_KEY, [productId, ...items])
    }
}

/**
 * Removes a product ID from the list of recent items in localStorage.
 * localStorage에서 최근 항목 목록에서 특정 제품 ID를 제거합니다.
 */
export const removeRecentItemId = (productId: string) => {
    const items = getRecentItemIds() // Get the current list of recent item IDs
    setArray(
        RECENT_ITEM_IDS_KEY,
        items.filter((item) => item !== productId), // Remove the specific product ID from the list
    )
}

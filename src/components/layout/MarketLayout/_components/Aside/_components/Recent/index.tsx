import { useCallback, useEffect, useMemo, useState } from 'react'
import RecentItem from './_components/RecentItem'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getProduct } from '@/repository/products/getProduct' // Fetch product details API
import { Product } from '@/types'
import { RECENT_ITEM_IDS_KEY, getRecentItemIds } from '@/utils/localstorage'

/**
 * Recent Products Component
 * Displays a list of recently viewed products, fetched from local storage, with pagination support.
 * 최근 본 상품 목록을 로컬 저장소에서 가져와 페이지 네이션과 함께 표시합니다.
 */
export default function Recent() {
    // Loading state for product data (상품 데이터 로딩 상태)
    const [isLoading, setIsLoading] = useState(false)

    // List of recent products (최근 본 상품 목록)
    const [recentProducts, setRecentProducts] = useState<Product[]>([])

    // Current page in pagination (페이지 네이션의 현재 페이지)
    const [currentPage, setCurrentPage] = useState(0)

    // Calculate total number of pages for pagination (페이지 네이션의 총 페이지 수 계산)
    const totalPage = useMemo(
        () => Math.max(Math.ceil(recentProducts.length / 3) - 1, 0), // Each page contains 3 items (각 페이지는 3개의 항목을 포함)
        [recentProducts],
    )

    // Adjust the current page if the total number of pages decreases
    // 총 페이지 수가 감소하면 현재 페이지를 조정합니다.
    useEffect(() => {
        setCurrentPage((_curPage) => Math.min(_curPage, totalPage))
    }, [totalPage])

    /**
     * Fetch and update recent products (최근 본 상품 데이터를 가져와 업데이트합니다.)
     */
    const handleUpdateRecentProducts = useCallback(async () => {
        try {
            setIsLoading(true) // Show loading spinner (로딩 스피너 표시)
            const recentIds = getRecentItemIds() // Get recent product IDs from local storage (로컬 저장소에서 최근 상품 ID 가져오기)
            const results = await Promise.all(
                recentIds.map((productId) => getProduct(productId)), // Fetch product data for each ID (각 ID에 대한 상품 데이터 가져오기)
            )
            const products = results.map(({ data }) => data) // Extract product data from API results (API 결과에서 상품 데이터 추출)
            setRecentProducts(products) // Update the state with recent products (최근 본 상품으로 상태 업데이트)
        } finally {
            setIsLoading(false) // Hide loading spinner (로딩 스피너 숨기기)
        }
    }, [])

    /**
     * Fetch recent products when the component mounts (컴포넌트가 마운트될 때 최근 본 상품 데이터를 가져옵니다.)
     */
    useEffect(() => {
        handleUpdateRecentProducts()
    }, [handleUpdateRecentProducts])

    useEffect(() => {
        // Define an event handler to trigger handleUpdateRecentProducts when the event RECENT_ITEM_IDS_KEY is dispatched
        // RECENT_ITEM_IDS_KEY 이벤트가 발생할 때 handleUpdateRecentProducts를 호출하는 이벤트 핸들러 정의
        const eventHandler = () => handleUpdateRecentProducts()

        // Add an event listener for RECENT_ITEM_IDS_KEY when the component mounts
        // 컴포넌트가 마운트되었을 때 RECENT_ITEM_IDS_KEY에 대한 이벤트 리스너 추가
        window.addEventListener(RECENT_ITEM_IDS_KEY, eventHandler)

        return () =>
            // Clean up: Remove the event listener when the component unmounts or when dependencies change
            // 정리: 컴포넌트가 언마운트되거나 의존성이 변경될 때 이벤트 리스너 제거
            window.removeEventListener(RECENT_ITEM_IDS_KEY, eventHandler)
    }, [handleUpdateRecentProducts])

    return (
        <div className="border border-uclaBlue p-2 bg-white flex flex-col items-center text-center">
            {/* Title */}
            <Text size="sm">Your Browsing History</Text>

            {/* Show loading spinner during data fetching (데이터 가져오는 동안 로딩 스피너 표시) */}
            {isLoading ? (
                <div className="py-5">
                    <Spinner />
                </div>
            ) : recentProducts.length === 0 ? ( // No recent products found (최근 본 상품이 없는 경우)
                <div className="mt-2 text-center">
                    <Text size="xs" color="grey" className="block">
                        No recently viewed products.
                    </Text>
                </div>
            ) : (
                <>
                    {/* Total number of recent products (최근 본 상품 총 개수) */}
                    <Text size="sm" color="red" weight="bold">
                        {recentProducts.length}
                    </Text>

                    {/* Product list with pagination (페이지 네이션이 있는 상품 목록) */}
                    <div className="border-t border-lightestBlue border-dashed pt-3 mt-2 flex flex-col gap-2">
                        {recentProducts
                            .slice(currentPage * 3, (currentPage + 1) * 3) // Show 3 items per page (페이지당 3개 항목 표시)
                            .map(({ id, title, price, imageUrls }) => (
                                <RecentItem
                                    key={id}
                                    id={id}
                                    title={title}
                                    price={price}
                                    imageUrl={imageUrls[0]}
                                />
                            ))}
                    </div>

                    {/* Pagination controls (페이지 네이션 컨트롤) */}
                    <div className="flex justify-between items-center mt-2 gap-1">
                        {/* Previous page button (이전 페이지 버튼) */}
                        <button
                            className="border border-uclaBlue h-5 w-5 flex justify-center items-center"
                            disabled={currentPage === 0} // Disable if on the first page (첫 페이지일 경우 비활성화)
                            onClick={() => setCurrentPage(currentPage - 1)} // Navigate to previous page (이전 페이지로 이동)
                        >
                            <Text size="xs" color="uclaBlue">
                                {'<'}
                            </Text>
                        </button>

                        {/* Current page / Total pages (현재 페이지 / 총 페이지 수) */}
                        <Text size="xs" color="uclaBlue">
                            {currentPage + 1} / {totalPage + 1}
                        </Text>

                        {/* Next page button (다음 페이지 버튼) */}
                        <button
                            className="border border-uclaBlue h-5 w-5 flex justify-center items-center"
                            disabled={currentPage === totalPage} // Disable if on the last page (마지막 페이지일 경우 비활성화)
                            onClick={() => setCurrentPage(currentPage + 1)} // Navigate to next page (다음 페이지로 이동)
                        >
                            <Text size="xs" color="uclaBlue">
                                {'>'}
                            </Text>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

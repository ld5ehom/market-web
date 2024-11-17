type Props = {
    /** The current page that the user is viewing */
    // 현재 사용자가 보고 있는 페이지
    currentPage: number
    /** The total number of items (each page contains 10 items) */
    // 전체 항목의 갯수 (단, 한 페이지는 10개의 항목을 가지고 있어야 한다)
    count: number
    /** Callback function called when the user changes the page */
    // 사용자가 페이지를 변경하였을 때 호출할 콜백 함수
    handlePageChange: (pageNumber: number) => void
}

// CSS class name for the pagination buttons 페이지네이션 버튼을 위한 CSS 클래스 이름
const btnClassName =
    'border border-uclaBlue px-2 py-2 flex justify-center items-center leading-none disabled:opacity-30 hover:bg-slate-200 rounded-lg'

// Pagination component 페이지네이션 컴포넌트
export default function Pagination({
    currentPage,
    count,
    handlePageChange,
}: Props) {
    // Calculate the total number of pages 전체 페이지 수 계산
    const totalPage = Math.ceil(count / 10)

    // Calculate the start and end page indices for pagination
    // 페이지네이션의 시작 및 끝 페이지 인덱스를 계산
    const startPageIndex = Math.max(1, Math.min(totalPage - 4, currentPage - 2))
    const endPageIndex = Math.min(startPageIndex + 4, totalPage)

    // If there are less than 2 pages, do not render the pagination
    // 페이지가 2개 미만이면 페이지네이션을 렌더링하지 않음
    if (totalPage < 2) {
        return null
    }

    return (
        <div className="flex gap-1 my-3">
            {/* Previous button */}
            <button
                className={btnClassName}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </button>

            {/* Page number buttons */}
            {Array.from({ length: endPageIndex - startPageIndex + 1 }).map(
                (_, idx) => {
                    const pageIndex = startPageIndex + idx
                    return (
                        <button
                            className={btnClassName}
                            key={pageIndex}
                            disabled={pageIndex === currentPage}
                            onClick={() => handlePageChange(pageIndex)}
                        >
                            {pageIndex}
                        </button>
                    )
                },
            )}

            {/* Next button */}
            <button
                className={btnClassName}
                disabled={currentPage === totalPage}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    )
}

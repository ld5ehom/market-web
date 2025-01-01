import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import Image from 'next/image'

// Banner component that displays a carousel of images
// 이미지를 보여주는 캐러셀 배너 컴포넌트
export default function Banner() {
    const bannerBaseUrl = 'https://raw.githubusercontent.com/ld5ehom/data/main/' // GitHub 배너 기본 URL
    const bannerPaths = [
        'banner1.jpg',
        'banner2.jpg',
        'banner3.jpg',
        'banner4.png',
        'banner5.png',
    ] // 배너 이미지 경로 배열

    return (
        <Carousel
            className="my-8" // Adds margin to the carousel (캐러셀에 여백 추가)
            infiniteLoop // Enables infinite looping of the carousel slides (무한 루프)
            showThumbs={false} // Hides the thumbnail previews (썸네일 미리보기를 숨김)
            showStatus={false} // Hides the slide status indicator (슬라이드 상태 표시기를 숨김)
            autoPlay // Automatically transitions between slides (자동 전환)
            interval={5000} // Sets the interval to 5 seconds (5초마다 전환)
        >
            {bannerPaths.map((path, idx) => (
                // Create slides for each banner image
                // 각 배너 이미지를 위한 슬라이드를 생성
                <div key={idx} className="h-96">
                    <Image
                        src={`${bannerBaseUrl}${path}`} // Combine base URL with specific image path
                        className="w-full h-full"
                        layout="fill" // 이미지가 부모 요소를 채우도록 설정
                        alt={`Banner ${idx + 1}`} // Alt text for accessibility
                    />
                </div>
            ))}
        </Carousel>
    )
}

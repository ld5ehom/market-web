import { faker } from '@faker-js/faker'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import Image from 'next/image'

// Banner component that displays a carousel of images
// 이미지를 보여주는 캐러셀 배너 컴포넌트
export default function Banner() {
    // Carousel component from react-responsive-carousel library
    // react-responsive-carousel 라이브러리의 Carousel 컴포넌트
    return (
        <Carousel
            className="my-8 " // Adds margin to the carousel (캐러셀에 여백 추가)
            infiniteLoop // Enables infinite looping of the carousel slides (무한 루프)
            showThumbs={false} // Hides the thumbnail previews (썸네일 미리보기를 숨김)
            showStatus={false} // Hides the slide status indicator (슬라이드 상태 표시기를 숨김)
        >
            {Array.from({ length: 3 }).map((_, idx) => (
                // Creates an array of 3 items to generate three slides
                // 3개의 아이템을 생성하여 세 개의 슬라이드를 만듦
                <div key={idx} className="h-96">
                    <Image
                        src={faker.image.dataUri()}
                        className="w-full h-full rounded-lg"
                        layout="fill" // 이미지가 부모 요소를 채우도록 설정
                        alt={''}
                    />
                </div>
            ))}
        </Carousel>
    )
}

// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>

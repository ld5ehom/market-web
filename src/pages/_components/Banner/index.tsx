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
                        src={
                            'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22640%22%20height%3D%22480%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23c30b4e%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22240%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E640x480%3C%2Ftext%3E%3C%2Fsvg%3E'
                        }
                        className="w-full h-full"
                        fill // 이미지가 부모 요소를 채우도록 설정
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

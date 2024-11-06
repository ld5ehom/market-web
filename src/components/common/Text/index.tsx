import React from 'react'
import classNames from 'classnames'

interface Props extends React.ComponentPropsWithoutRef<'span'> {
    // Set the size of the text. (default: md)
    // 텍스트의 크기를 설정합니다. (기본값: md)
    size?: '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'

    // Set the color of the text. (default: black)
    // 텍스트의 색상을 설정합니다. (기본값: black)
    color?:
        | 'black'
        | 'grey'
        | 'red'
        | 'white'
        | 'uclaBlue'
        | 'darkestBlue'
        | 'darkerBlue'
        | 'lighterBlue'
        | 'lightestBlue'
        | 'uclaGold'
        | 'darkestGold'
        | 'darkerGold'

    // Set the font weight of the text. (default: normal)
    // 텍스트의 굵기를 설정합니다. (기본값: normal)
    weight?: 'light' | 'normal' | 'bold'

    fontFamily?: string // 폰트 패밀리 설정 추가
}

// A component for displaying generic text
// 일반적인 텍스트를 표시하기 위한 컴포넌트
export default function Text({
    size = 'md',
    color = 'black',
    weight = 'normal',
    fontFamily = "'Black Han Sans', sans-serif", // 기본 폰트 패밀리 설정
    ...props
}: Props) {
    return (
        <span
            {...props}
            style={{ fontFamily }} // 세미콜론 없이 fontFamily 설정
            className={classNames(
                props.className,
                {
                    // Size classes
                    'text-4xl': size === '4xl',
                    'text-3xl': size === '3xl',
                    'text-2xl': size === '2xl',
                    'text-xl': size === 'xl',
                    'text-lg': size === 'lg',
                    'text-base': size === 'md',
                    'text-sm': size === 'sm',
                    'text-xs': size === 'xs',
                },
                {
                    // Color classes
                    'text-black': color === 'black',
                    'text-zinc-400': color === 'grey',
                    'text-red-500': color === 'red',
                    'text-white': color === 'white',
                    'text-uclaBlue': color === 'uclaBlue',
                    'text-darkestBlue': color === 'darkestBlue',
                    'text-darkerBlue': color === 'darkerBlue',
                    'text-lighterBlue': color === 'lighterBlue',
                    'text-lightestBlue': color === 'lightestBlue',
                    'text-uclaGold': color === 'uclaGold',
                    'text-darkestGold': color === 'darkestGold',
                    'text-darkerGold': color === 'darkerGold',
                },
                {
                    // Font weight classes
                    'font-light': weight === 'light',
                    'font-normal': weight === 'normal',
                    'font-bold': weight === 'bold',
                },
            )}
        >
            {props.children}
        </span>
    )
}

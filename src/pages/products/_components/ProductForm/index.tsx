import { useRef, useState } from 'react'
import ProductsLayout from '../ProductsLayout'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import Container from '@/components/layout/Container'
import { City, cities, getDistricts } from '@/utils/address'

type Props = {
    id: string
    imageUrls: string[]
    title: string
    isUsed: boolean
    isChangable: boolean
    price: number
    city: City
    district: string
    description: string
    tags: string[]
}

export default function ProductForm({
    id: defaultId,
    imageUrls: defaultImageUrls,
    title: defaultTitle,
    isUsed: defaultIsUsed,
    isChangable: defaultIsChangable,
    price: defaultPrice,
    city: defaultCity,
    district: defaultDistrict,
    description: defaultDescription,
    tags: defaultTags,
}: Partial<Props>) {
    const tagInputRef = useRef<HTMLInputElement>(null)
    const [tags, setTags] = useState<string[]>(defaultTags || [])
    const [city, setCity] = useState<City | undefined>(defaultCity)

    // Handles image uploads (이미지 업로드를 처리하는 함수)
    const uploadImage = (file: File) => {
        alert(file.name) // Displays the file name in an alert (파일 이름을 알림으로 표시)
    }

    // Adds a new tag to the tag list (태그 리스트에 새 태그 추가)
    const handleAddTag = () => {
        if (!tagInputRef.current) {
            return
        }
        const tagValue = tagInputRef.current.value.trim()
        tagInputRef.current.value = ''
        if (tags.length >= 5) {
            return
        }
        setTags((prevTags) => {
            if (!prevTags.find((tag) => tag === tagValue)) {
                return [...prevTags, tagValue]
            }
            return prevTags
        })
    }

    // Removes a tag from the tag list (태그 리스트에서 태그 제거)
    const handleRemoveTag = (tag: string) => {
        setTags((prevTags) => prevTags.filter((tagItem) => tagItem !== tag))
    }

    return (
        <ProductsLayout currentTab={defaultId ? undefined : 'new'}>
            <form>
                {defaultId && (
                    <input type="hidden" name="id" defaultValue={defaultId} />
                )}
                <Container>
                    {/* Section Header (섹션 헤더) */}
                    <div className="my-10 border-b-2 border-black py-7">
                        <Text size="2xl" className="mr-3">
                            {defaultId ? 'Edit Product' : 'Product Information'}
                        </Text>
                        <Text size="md" color="red">
                            * Required Information
                        </Text>
                    </div>

                    {/* Image Upload Section (이미지 업로드 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            {/* 상품 이미지 */}
                            <Text size="lg">Product Image</Text>{' '}
                            <Text size="lg" color="grey" weight="light">
                                (0/3)
                            </Text>
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div>
                            <>
                                <label htmlFor="image">
                                    <div className="w-40 h-40 border flex justify-center items-center cursor-pointer">
                                        Upload File
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    accept=".jpg, .jpeg, .png"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files![0]) {
                                            uploadImage(e.target.files![0])
                                        }
                                    }}
                                />
                            </>
                        </div>
                    </div>

                    {/* Product Name Section (상품명 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Product Name</Text>
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <Input
                                type="text"
                                className="w-full px-3 py-2"
                                placeholder="Enter the product name"
                                name="title"
                                defaultValue={defaultTitle}
                                required
                            />
                        </div>
                    </div>

                    {/* Product Condition Section (상품 상태 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Product Condition</Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <select
                                required
                                name="isUsed"
                                className="border py-1 px-2 w-32"
                                defaultValue={
                                    defaultIsUsed === undefined
                                        ? undefined
                                        : defaultIsUsed
                                          ? 'y'
                                          : 'n'
                                }
                            >
                                <option value="y">New</option>
                                <option value="n">Used</option>
                            </select>
                        </div>
                    </div>

                    {/* Price Section (가격 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Price</Text>
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <Input
                                type="number"
                                className="w-full px-3 py-2"
                                placeholder="Enter the price"
                                name="price"
                                defaultValue={defaultPrice}
                                required
                            />
                        </div>
                    </div>

                    {/* Tags Section (태그 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Product Tags</Text>{' '}
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {tags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="bg-purple-200 rounded-lg px-2 flex justify-center items-center"
                                    >
                                        {tag}
                                        <span
                                            className="material-symbols-outlined cursor-pointer"
                                            style={{ fontSize: '1.25rem' }}
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            close
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-96">
                                <Input
                                    className="flex-1"
                                    name="tag"
                                    type="text"
                                    placeholder="Add tags (up to 5)"
                                    ref={tagInputRef}
                                    disabled={tags.length >= 5}
                                />
                                <Button
                                    type="button"
                                    disabled={tags.length >= 5}
                                    color="uclaBlue"
                                    onClick={() => {
                                        handleAddTag()
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Description Section (상품 설명 섹션) */}
                    <div className="flex border-b border-grey-300 pb-7 pt-5">
                        <div className="w-40">
                            <Text size="lg">Product Description</Text>{' '}
                            <Text size="md" color="red">
                                *
                            </Text>
                        </div>
                        <div className="flex-1">
                            <textarea
                                name="description"
                                required
                                className="p-2 border w-full outline-none"
                                defaultValue={defaultDescription}
                            />
                        </div>
                    </div>
                </Container>

                {/* Submit Button (제출 버튼) */}
                <div className="sticky bottom-0 z-50 bg-lightestBlue py-4 border-t border-lightestBlue">
                    <Container>
                        <div className="flex justify-end">
                            <Button color="uclaBlue" className="w-28 h-12">
                                {defaultId ? 'Edit' : 'Submit'}{' '}
                                {/* 수정하기 / 등록하기 */}
                            </Button>
                        </div>
                    </Container>
                </div>
            </form>
        </ProductsLayout>
    )
}

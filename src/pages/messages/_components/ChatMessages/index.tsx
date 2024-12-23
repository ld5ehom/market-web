import {
    ChangeEventHandler,
    FormEventHandler,
    useEffect,
    useRef,
    useState,
} from 'react'

import Messages from './_components/Messages'
import Spinner from '@/components/common/Spinner'
import Text from '@/components/common/Text'
import { getShop } from '@/repository/shops/getShop'
import { Shop } from '@/types'
import supabase from '@/utils/supabase/browserSupabase'

type Props = {
    chatRoomId: string // The ID of the chat room
    myShopId: string // The ID of the current user's shop
    counterShopId: string // The ID of the shop the user is chatting with
}

export default function ChatMessages({
    chatRoomId,
    myShopId,
    counterShopId,
}: Props) {
    const [counterShop, setCounterShop] = useState<Shop>() // Stores data for the counter shop
    const ref = useRef<HTMLInputElement>(null) // Reference to the input field

    useEffect(() => {
        // Fetch shop data for the counter shop
        ;(async () => {
            const { data } = await getShop(supabase, counterShopId)
            setCounterShop(data) // Update state with fetched shop data
        })()
    }, [counterShopId])

    const handleSubmitMessage: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault() // Prevent the form's default submission behavior
        if (ref.current) {
            alert(ref.current?.value) // Show the input value in an alert
            ref.current.value = '' // Clear the input field
            ref.current.focus() // Refocus the input field
        }
    }

    const handleChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
        // Handle image file selection
        if (e.target.files?.[0]) {
            console.log(e.target.files[0]) // Log the selected file
            e.target.value = '' // Clear the input value
        }
    }

    if (!counterShop) {
        // Show a loading spinner if the counter shop data is not yet loaded
        return (
            <div className="h-full flex justify-center items-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header displaying the counter shop's name */}
            <div className="border-b border-gray-100 p-2 sticky top-0 bg-white z-50 h-12">
                <Text size="lg" weight="bold">
                    {counterShop.name}
                </Text>
            </div>

            {/* Render the Messages component */}
            <Messages
                chatRoomId={chatRoomId}
                myShopId={myShopId}
                counterShopId={counterShopId}
            />

            {/* Input field and image upload for sending messages */}
            <div className="bg-white py-2">
                <form
                    onSubmit={handleSubmitMessage}
                    className="bg-slate-100 w-full rounded-3xl px-4 py-1 flex justify-center items-center"
                >
                    <input
                        ref={ref}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter your message."
                        className="outline-0 bg-transparent flex-1"
                    />
                    <label
                        htmlFor="image"
                        className="flex justify-center items-center cursor-pointer"
                    >
                        <span className="material-symbols-outlined">
                            photo_camera
                        </span>
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept=".jpg, .jpeg, .png"
                        hidden
                        onChange={handleChangeImage}
                    />
                </form>
            </div>
        </div>
    )
}

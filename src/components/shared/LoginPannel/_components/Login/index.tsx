import { FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import supabase from '@/utils/supabase/browserSupabase'

interface Props {
    handleSetType: (type?: 'login' | 'signup') => void
}

export default function Login({ handleSetType }: Props) {
    // supbase login
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            alert(error.message)
            return
        }
        location.reload()
    }

    return (
        <form
            className="my-2 flex flex-col gap-2 w-full"
            onSubmit={handleSubmit}
        >
            <Input name="email" placeholder="Email" required />
            <Input name="password" placeholder="password" required />

            <div className="flex flex-col gap-2 w-full">
                <Button
                    type="submit"
                    outline
                    className="bg-uclaBlue !text-uclaGold"
                >
                    Login
                </Button>

                <Button
                    type="button"
                    className="bg-uclaBlue !text-uclaGold"
                    onClick={() => handleSetType('signup')}
                >
                    Sign Up
                </Button>
            </div>
        </form>
    )
}

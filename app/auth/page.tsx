import { SignInButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SignInButton mode="redirect">
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md">
                    Sign in
                </button>
            </SignInButton>
            <SignInButton mode="redirect">
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md">
                    Sign in with Email
                </button>
            </SignInButton>
        </div>
    )
}

export default page

'use client'

import React from 'react'
import { DropdownMenuItem } from './ui/dropdown-menu'
import { signOut } from '../lib/auth/auth-client'
import { router } from 'better-auth/api'
import { useRouter } from 'next/navigation'

const SignOut = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    const result = await signOut()

    if (result.data) {
      router.push('/sign-in')
    } else {
      alert('Error signing out')
    }
  }

  return <DropdownMenuItem onClick={handleSignOut}>Log Out</DropdownMenuItem>
}

export default SignOut

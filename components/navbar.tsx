'use client'

import React from 'react'
import { BriefcaseIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import SignOut from './sign-out'
import { useSession } from '../lib/auth/auth-client'

const Navbar = () => {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-primary flex items-center gap-2 text-xl font-semibold"
        >
          <BriefcaseIcon />
          Job Tracker
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {session.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="leadning-none text-sm font-medium">
                        {session.user.name}
                      </p>
                      <p className="font-muted-foreground leadning-none text-sm">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <SignOut />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Log In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90">
                  Start for Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

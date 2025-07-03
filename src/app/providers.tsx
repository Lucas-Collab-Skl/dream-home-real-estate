'use client'

import { HeroUIProvider } from '@heroui/react'
import { UserProvider } from './userContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </HeroUIProvider>
  )
}
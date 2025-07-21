'use client'

import { HeroUIProvider } from '@heroui/react'
import { UserProvider } from './userContext'
import {ToastProvider} from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <UserProvider>
        <ToastProvider/>
        {children}
      </UserProvider>
    </HeroUIProvider>
  )
}
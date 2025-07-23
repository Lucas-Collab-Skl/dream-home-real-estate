'use client'

import { HeroUIProvider } from '@heroui/react'
import { UserProvider } from './userContext'
import {ToastProvider} from "@heroui/toast";
import {ThemeProvider as NextThemeProvider} from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <UserProvider>
        <NextThemeProvider>
          <ToastProvider/>
          {children}
        </NextThemeProvider>
      </UserProvider>
    </HeroUIProvider>
  )
}
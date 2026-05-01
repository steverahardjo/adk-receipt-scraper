'use client'

import * as React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './Sidebar'

export default function BaseLayer({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/20">
        {/* Sidebar (desktop + mobile handled internally) */}
        <AppSidebar />

        {/* Content */}
        <SidebarInset>
          <main className="p-4 md:p-8">
            <div className="min-h-[80vh] rounded-[2rem] bg-background border shadow-sm p-6 md:p-8">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

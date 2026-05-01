'use client'

import * as React from 'react'
// Use the exact name from the file.
// If you used 'export default', this name can be anything,
// but let's keep it consistent.
import AppSidebar from './app-sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const user = {
  name: 'HolyKnight',
  email: 'user@example.com',
  avatar: '',
}

export default function BaseLayer({ children }: { children: React.ReactNode }) {
  // Debug: If this logs 'undefined', the file path or export in app-sidebar is wrong.
  console.log('AppSidebar Check:', AppSidebar)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/20">
        {/* 1. The Sidebar itself */}
        {AppSidebar ? (
          <AppSidebar userName={user.name} avatarUrl={user.avatar} />
        ) : (
          <div className="p-4 text-red-500">Sidebar Missing</div>
        )}

        <SidebarInset>
          {/* 2. Added a Header area with a Trigger for mobile accessibility */}
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>

          <main className="p-4 md:p-8 pt-0">
            <div className="min-h-[80vh] rounded-[2rem] bg-background border shadow-sm p-6 md:p-8">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

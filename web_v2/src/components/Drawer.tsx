'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion' // Ensure you have the shadcn accordion component
import { Button } from '@/components/ui/button'
import { Link, useRouterState } from '@tanstack/react-router'
import { Branding } from '#/config/Branding'
import { navItems, bottomItems } from '#/config/Navigation'

export default function MobileDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background flex flex-col max-h-[92dvh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-3">
            <Branding.app.Logo className="h-6 w-6" />
            <DrawerTitle className="text-base font-semibold">
              {Branding.app.name}
            </DrawerTitle>
          </div>
        </DrawerHeader>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const hasChildren = item.items && item.items.length > 0
              const isActive =
                pathname === item.url ||
                item.items?.some((sub) => sub.url === pathname)

              if (!hasChildren) {
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => onOpenChange(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      pathname === item.url
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                )
              }

              return (
                <AccordionItem
                  value={item.title}
                  key={item.title}
                  className="border-none"
                >
                  <AccordionTrigger
                    className={`px-3 py-3 hover:no-underline hover:bg-muted rounded-lg transition-colors ${isActive ? 'text-primary' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-2 pl-10 flex flex-col gap-1">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.title}
                        to={sub.url}
                        onClick={() => onOpenChange(false)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          pathname === sub.url
                            ? 'text-primary font-semibold bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {/* FOOTER */}
        <DrawerFooter className="border-t bg-muted/20">
          <div className="flex flex-col gap-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.url
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => onOpenChange(false)}
                >
                  <Button
                    variant={active ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3 h-11"
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
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
      <DrawerContent className="bg-background flex flex-col">
        {/* HEADER */}
        <DrawerHeader>
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Branding.app.Logo className="h-6 w-6" />

            {/* App Name */}
            <DrawerTitle className="text-base font-semibold">
              {Branding.app.name}
            </DrawerTitle>
          </div>
        </DrawerHeader>
        {/* GRID NAVIGATION */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.to

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => onOpenChange(false)}
              >
                <div
                  className={`
                    rounded-xl border p-4 flex flex-col items-center justify-center gap-2
                    text-center cursor-pointer
                    transition-all duration-150
                    hover:scale-[1.03] active:scale-[0.97]
                    ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-muted/40 hover:bg-muted border-border'
                    }
                  `}
                >
                  {/* ICON */}
                  <div
                    className={`
                      h-10 w-10 flex items-center justify-center rounded-full
                      ${active ? 'bg-primary-foreground/20' : 'bg-background'}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* LABEL */}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* FOOTER */}
        <DrawerFooter className="mt-auto">
          <div className="flex flex-col gap-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => onOpenChange(false)}
                >
                  <Button
                    variant={active ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          <DrawerClose asChild>
            <Button variant="outline" className="w-full mt-3">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

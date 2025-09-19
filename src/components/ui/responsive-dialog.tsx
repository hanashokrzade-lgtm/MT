"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile-check"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface ResponsiveDialogProps {
  trigger: React.ReactNode
  dialogContent: React.ReactNode
  drawerContent: React.ReactNode
}

export function ResponsiveDialog({
  trigger,
  dialogContent,
  drawerContent,
}: ResponsiveDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      {drawerContent}
    </Drawer>
  )
}

    
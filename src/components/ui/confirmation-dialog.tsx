"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <Card className="relative w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {variant === "destructive" && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for easier usage
export function useConfirmationDialog() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: "",
    description: ""
  })

  const showConfirmation = React.useCallback((config: {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
    onConfirm: () => void
  }) => {
    setDialog({
      isOpen: true,
      ...config
    })
  }, [])

  const hideConfirmation = React.useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }))
  }, [])

  const handleConfirm = React.useCallback(() => {
    if (dialog.onConfirm) {
      dialog.onConfirm()
    }
    hideConfirmation()
  }, [dialog, hideConfirmation])

  const ConfirmationDialogComponent = React.useCallback(() => (
    <ConfirmationDialog
      isOpen={dialog.isOpen}
      title={dialog.title}
      description={dialog.description}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
      variant={dialog.variant}
      onConfirm={handleConfirm}
      onCancel={hideConfirmation}
    />
  ), [dialog, handleConfirm, hideConfirmation])

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationDialog: ConfirmationDialogComponent
  }
}

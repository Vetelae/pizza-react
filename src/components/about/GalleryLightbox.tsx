import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

export interface GalleryImage {
  src: string
  alt: string
  title: string
}

interface GalleryLightboxProps {
  images: readonly GalleryImage[]
  selectedIndex: number | null
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

const focusableElementSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function GalleryLightbox({
  images,
  selectedIndex,
  onClose,
  onPrevious,
  onNext,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const isOpen = selectedIndex !== null

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousBodyOverflow
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onPrevious()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNext()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          focusableElementSelector
        ) ?? []
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (
        event.shiftKey &&
        (activeElement === firstElement ||
          !dialogRef.current?.contains(activeElement))
      ) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrevious])

  if (selectedIndex === null) return null

  const selectedImage = images[selectedIndex]
  if (!selectedImage) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-lightbox-title"
        aria-describedby="gallery-lightbox-position"
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-night shadow-2xl ring-1 ring-white/20"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 text-white sm:px-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-orange uppercase">
              Restaurant gallery
            </p>
            <h2
              id="gallery-lightbox-title"
              className="mt-1 text-lg font-bold sm:text-xl"
            >
              {selectedImage.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-orange hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/40">
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-[calc(92vh-9rem)] w-full object-contain"
          />

          <button
            type="button"
            onClick={onPrevious}
            aria-label="View previous image"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg transition-colors hover:bg-orange hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:left-5 sm:h-12 sm:w-12"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="View next image"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg transition-colors hover:bg-orange hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:right-5 sm:h-12 sm:w-12"
          >
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>

        <p
          id="gallery-lightbox-position"
          aria-live="polite"
          className="px-5 py-3 text-center text-sm font-medium text-gray-300 sm:px-6"
        >
          Image {selectedIndex + 1} of {images.length}
        </p>
      </div>
    </div>,
    document.body
  )
}

export default GalleryLightbox

import { useCallback, useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaPause,
  FaPlay,
} from 'react-icons/fa'
import kitchen from '@/assets/images/kitchen.png'
import restaurant from '@/assets/images/restaurant.jpg'
import tables from '@/assets/images/tables.png'
import wall from '@/assets/images/wall.png'
import GalleryLightbox, { type GalleryImage } from './GalleryLightbox'

const galleryImages: readonly GalleryImage[] = [
  {
    src: kitchen,
    alt: 'PizzaShop kitchen and food preparation counter',
    title: 'Our Kitchen',
  },
  {
    src: restaurant,
    alt: 'PizzaShop dining room with tables and a pizza oven',
    title: 'The Restaurant',
  },
  {
    src: tables,
    alt: 'Restaurant seating beside large windows',
    title: 'A Place to Gather',
  },
  {
    src: wall,
    alt: 'Framed specials menu on the restaurant wall',
    title: 'The Little Details',
  },
]

function AboutGallery() {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 4500,
      stopOnInteraction: true,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
      breakpoints: {
        '(prefers-reduced-motion: reduce)': { active: false },
      },
    })
  )
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      slidesToScroll: 1,
      breakpoints: {
        '(prefers-reduced-motion: reduce)': { duration: 0 },
      },
    },
    [autoplay]
  )
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const shouldAutoplayRef = useRef(true)
  const isCarouselHoveredRef = useRef(false)
  const isCarouselFocusedRef = useRef(false)
  const scrollSnaps = emblaApi?.scrollSnapList() ?? []

  const updateCarouselState = useCallback(() => {
    if (!emblaApi) return

    setSelectedSnap(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', updateCarouselState)
    emblaApi.on('reInit', updateCarouselState)

    return () => {
      emblaApi.off('select', updateCarouselState)
      emblaApi.off('reInit', updateCarouselState)
    }
  }, [emblaApi, updateCarouselState])

  const playAutoplayIfAllowed = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (
      shouldAutoplayRef.current &&
      !isCarouselHoveredRef.current &&
      !isCarouselFocusedRef.current &&
      !prefersReducedMotion
    ) {
      autoplay.play()
    }
  }, [autoplay])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerUp', playAutoplayIfAllowed)
    return () => {
      emblaApi.off('pointerUp', playAutoplayIfAllowed)
    }
  }, [emblaApi, playAutoplayIfAllowed])

  const resetAutoplay = useCallback(() => {
    if (shouldAutoplayRef.current) autoplay.reset()
  }, [autoplay])

  const scrollPrevious = useCallback(() => {
    emblaApi?.scrollPrev()
    resetAutoplay()
  }, [emblaApi, resetAutoplay])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
    resetAutoplay()
  }, [emblaApi, resetAutoplay])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
      resetAutoplay()
    },
    [emblaApi, resetAutoplay]
  )

  const toggleAutoplay = useCallback(() => {
    const nextPausedState = !isAutoplayPaused
    setIsAutoplayPaused(nextPausedState)
    shouldAutoplayRef.current = !nextPausedState && lightboxIndex === null

    if (nextPausedState) {
      autoplay.stop()
    } else {
      playAutoplayIfAllowed()
    }
  }, [
    autoplay,
    isAutoplayPaused,
    lightboxIndex,
    playAutoplayIfAllowed,
  ])

  const openLightbox = useCallback(
    (index: number) => {
      shouldAutoplayRef.current = false
      autoplay.stop()
      setLightboxIndex(index)
    },
    [autoplay]
  )

  const closeLightbox = useCallback(() => {
    shouldAutoplayRef.current = !isAutoplayPaused
    setLightboxIndex(null)
    playAutoplayIfAllowed()
  }, [isAutoplayPaused, playAutoplayIfAllowed])

  const pauseAutoplayOnHover = useCallback(() => {
    isCarouselHoveredRef.current = true
    autoplay.stop()
  }, [autoplay])

  const resumeAutoplayAfterHover = useCallback(() => {
    isCarouselHoveredRef.current = false
    playAutoplayIfAllowed()
  }, [playAutoplayIfAllowed])

  const pauseAutoplayOnFocus = useCallback(() => {
    isCarouselFocusedRef.current = true
    autoplay.stop()
  }, [autoplay])

  const resumeAutoplayAfterFocus = useCallback(() => {
    isCarouselFocusedRef.current = false
    playAutoplayIfAllowed()
  }, [playAutoplayIfAllowed])

  const showPreviousImage = useCallback(() => {
    setLightboxIndex((currentIndex) => {
      if (currentIndex === null) return null

      const previousIndex =
        (currentIndex - 1 + galleryImages.length) % galleryImages.length
      emblaApi?.scrollTo(previousIndex, true)
      return previousIndex
    })
  }, [emblaApi])

  const showNextImage = useCallback(() => {
    setLightboxIndex((currentIndex) => {
      if (currentIndex === null) return null

      const nextIndex = (currentIndex + 1) % galleryImages.length
      emblaApi?.scrollTo(nextIndex, true)
      return nextIndex
    })
  }, [emblaApi])

  return (
    <section
      aria-labelledby="about-gallery-heading"
      className="mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 md:pb-20 lg:pb-24"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-[0.2em] text-orange uppercase">
            Our Restaurant
          </p>
          <h2
            id="about-gallery-heading"
            className="mt-3 text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl"
          >
            A Look
            <span className="text-orange"> Inside</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg md:leading-8">
            Take a closer look at the warm, welcoming spaces where we prepare
            and serve your favorites.
          </p>
        </div>

        <div
          className="flex items-center gap-2"
          aria-label="Carousel controls"
        >
          <button
            type="button"
            onClick={scrollPrevious}
            aria-label="Show previous gallery image"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-gray-800 shadow-md ring-1 ring-orange/20 transition-colors hover:bg-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleAutoplay}
            aria-label={
              isAutoplayPaused
                ? 'Start automatic slideshow'
                : 'Pause automatic slideshow'
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-gray-800 shadow-md ring-1 ring-orange/20 transition-colors hover:bg-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hidden"
          >
            {isAutoplayPaused ? (
              <FaPlay aria-hidden="true" className="ml-0.5" />
            ) : (
              <FaPause aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Show next gallery image"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-gray-800 shadow-md ring-1 ring-orange/20 transition-colors hover:bg-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="PizzaShop restaurant gallery"
        className="mt-10"
        onMouseEnter={pauseAutoplayOnHover}
        onMouseLeave={resumeAutoplayAfterHover}
        onFocusCapture={pauseAutoplayOnFocus}
        onBlurCapture={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
          ) {
            return
          }

          resumeAutoplayAfterFocus()
        }}
      >
        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-4 flex touch-pan-y">
            {galleryImages.map((image, index) => (
              <div
                key={image.title}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${galleryImages.length}`}
                className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  aria-label={`Open ${image.title} in gallery`}
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-cream text-left shadow-xl ring-1 ring-gray-900/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="aspect-4/3 w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-black/75 to-transparent px-5 pt-16 pb-5"
                  >
                    <span className="text-lg font-bold text-white">
                      {image.title}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-gray-900 shadow-md transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                      <FaExpand />
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 flex justify-center gap-2"
          aria-label="Choose gallery image"
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Show gallery image ${index + 1}`}
              aria-current={index === selectedSnap ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange ${
                index === selectedSnap
                  ? 'w-8 bg-orange'
                  : 'w-2.5 bg-gray-400 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      <GalleryLightbox
        images={galleryImages}
        selectedIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrevious={showPreviousImage}
        onNext={showNextImage}
      />
    </section>
  )
}

export default AboutGallery

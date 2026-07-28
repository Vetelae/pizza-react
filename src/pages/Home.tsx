import { useMemo, type ReactNode } from 'react'
import {
  FaBookOpen,
  FaClipboardList,
  FaFire,
  FaLeaf,
  FaUtensils,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import pizzaJpeg from '../assets/images/pizza.jpeg'
import ig from '../assets/images/ig.png'
import { useNews } from '@/hooks/public/useNews'
import { formatDateWithWeekday } from '@/utils/formatters'

interface SectionHeadingProps {
  children: ReactNode
  id: string
}

const benefits = [
  {
    title: 'Fresh ingredients',
    description:
      'We prepare our pizzas with quality ingredients and fresh toppings.',
    icon: FaLeaf,
  },
  {
    title: 'Made to order',
    description:
      'Every pizza is assembled and baked only after you place your order.',
    icon: FaFire,
  },
  {
    title: 'Traditional recipes',
    description:
      'We combine familiar recipes with the flavours you already love.',
    icon: FaBookOpen,
  },
  {
    title: 'Something for everyone',
    description:
      'Choose from pizzas, kebabs, salads, sides, and refreshing drinks.',
    icon: FaUtensils,
  },
  {
    title: 'Easy ordering',
    description:
      'Choose dine-in or takeaway and place your order with ease.',
    icon: FaClipboardList,
  },
]

function SectionHeading({ children, id }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-2xl font-bold text-orange md:text-3xl">
        {children}
      </h2>
      <div className="mt-2 h-1 w-14 rounded-full bg-orange" aria-hidden="true" />
    </div>
  )
}

function Home() {
  const { data: news, isLoading, isError } = useNews()
  const featuredNews = useMemo(
    () =>
      [...(news ?? [])]
        .sort(
          (first, second) =>
            new Date(second.date).getTime() - new Date(first.date).getTime(),
        )
        .slice(0, 3),
    [news],
  )

  return (
    <div className="flex flex-col">
      <section className="relative min-h-96 overflow-hidden md:min-h-128">
        <img
          src={pizzaJpeg}
          alt="Freshly baked vegetable pizza"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-96 max-w-7xl items-center px-6 py-16 md:min-h-128 md:px-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-orange sm:text-5xl md:text-6xl">
              Fresh pizza, made your way.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-cream md:text-xl">
              Quality ingredients, generous toppings, and every pizza baked
              fresh to order.
            </p>
            <Link
              to="/menu"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-orange px-6 py-3 font-bold text-gray-950 shadow-lg transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
            >
              View our menu
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="Restaurant highlights"
        className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20"
      >
        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          <section
            aria-labelledby="news-heading"
            className="flex min-w-0 flex-col"
          >
            <SectionHeading id="news-heading">News &amp; Events</SectionHeading>
            <div className="flex-1 rounded-xl bg-gray-700 p-6 shadow-lg md:p-7 lg:min-h-[42rem]">
              {isLoading && (
                <div className="space-y-4" role="status">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-500" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-500" />
                  <div className="space-y-2">
                    <div className="h-3 animate-pulse rounded bg-gray-600" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-gray-600" />
                  </div>
                  <span className="sr-only">Loading news and events...</span>
                </div>
              )}

              {isError && (
                <p className="leading-7 text-gray-100">
                  We couldn&apos;t load the latest news right now. Please try
                  again later.
                </p>
              )}

              {!isLoading && !isError && featuredNews.length === 0 && (
                <p className="leading-7 text-gray-100">
                  There are no upcoming announcements at the moment. Check back
                  soon for restaurant news and special events.
                </p>
              )}

              {!isLoading &&
                !isError &&
                featuredNews.map((item) => (
                  <article
                    key={item.id}
                    className="border-b border-orange/25 py-6 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <time
                      dateTime={item.date}
                      className="text-sm font-semibold text-orange"
                    >
                      {formatDateWithWeekday(item.date)}
                    </time>
                    <h3 className="mt-2 text-xl font-bold text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-200 md:text-base">
                      {item.content}
                    </p>
                  </article>
                ))}
            </div>
          </section>

          <section
            aria-labelledby="why-heading"
            className="flex min-w-0 flex-col"
          >
            <SectionHeading id="why-heading">Why Choose Us?</SectionHeading>
            <div className="flex flex-1 flex-col gap-6 rounded-xl bg-gray-700 p-6 shadow-lg md:p-7 lg:min-h-[42rem] lg:justify-between">
              {benefits.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange/15 text-orange">
                    <Icon aria-hidden="true" className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-cream">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-200 md:text-base">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="story-heading"
            className="flex min-w-0 flex-col"
          >
            <SectionHeading id="story-heading">Follow Our Story</SectionHeading>
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-gray-700 shadow-lg lg:min-h-[42rem]">
              <div className="p-6 md:p-7">
                <h3 className="text-xl font-bold text-cream">
                  Fresh from our kitchen
                </h3>
                <p className="mt-2 leading-7 text-gray-200">
                  Follow us for new pizzas, special events, and a look behind
                  the scenes.
                </p>
              </div>
              <div className="relative mx-4 min-h-80 flex-1 overflow-hidden rounded-t-xl border-x border-t border-white/20 sm:mx-6">
                <img
                  src={ig}
                  alt="Preview of Pizza Shop's social media profile and pizza posts"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
              <p className="border-t border-white/10 px-6 py-5 text-center text-sm text-gray-200">
                Follow <span className="font-bold text-orange">@PizzaShop</span>{' '}
                and see what&apos;s cooking.
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-orange/25 bg-orange/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Ready for a slice?
            </h2>
            <p className="mt-2 text-lg text-gray-700">
              Browse our menu and find your new favourite.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-gray-800 px-6 py-3 font-bold text-orange shadow-md transition-colors hover:bg-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-800"
          >
            View our menu
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

import { FaFire, FaHeart, FaUsers, FaUtensils } from 'react-icons/fa'
import oven from '../assets/images/oven.png'
import AboutGallery from '@/components/about/AboutGallery'

const highlights = [
  {
    value: '10000+',
    label: 'Happy customers',
    icon: FaUsers,
  },
  {
    value: '20+',
    label: 'Menu Items',
    icon: FaUtensils,
  },
  {
    value: 'Fresh',
    label: 'Prepared Daily',
    icon: FaFire,
  },
  {
    value: '100%',
    label: 'Made with Care',
    icon: FaHeart,
  },
]

function About() {
  return (
    <div className="bg-powder">
      <section
        aria-labelledby="about-story-heading"
        className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20 lg:py-24"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-900/10">
            <img
              src={oven}
              alt="Fresh pizza in front of a wood-fired oven"
              className="aspect-5/4 h-full w-full object-cover object-center"
            />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-orange uppercase">
              Our Story
            </p>
            <h1
              id="about-story-heading"
              className="mt-3 text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl"
            >
              Great Food. Great People.
              <span className="block text-orange">Great Moments</span>
            </h1>

            <div className="mt-7 space-y-5 text-base leading-7 text-gray-700 md:text-lg md:leading-8">
              <p>
                Since <strong className="font-bold text-gray-900">2018</strong>,{' '}
                <strong className="font-bold text-gray-900">PizzaShop</strong>{' '}
                has been serving freshly prepared pizzas, kebabs, burgers, and
                other customer favorites to the local community. What started
                as a small neighborhood restaurant has grown into a place where
                friends and families come together to enjoy delicious food and
                friendly service.
              </p>
              <p>
                At PizzaShop, we believe that great meals begin with quality
                ingredients. Every order is prepared fresh using carefully
                selected ingredients and recipes designed to deliver the best
                flavor in every bite.
              </p>
              <p>
                Whether you&apos;re stopping by for a quick lunch, picking up
                dinner for the family, or ordering your favorite meal for
                delivery, our goal is simple: serve delicious food, generous
                portions, and provide an experience that keeps you coming back.
              </p>
              <p>
                Thank you for making PizzaShop a part of your everyday moments.
                We look forward to serving you for many years to come.
              </p>
            </div>

            <ul
              aria-label="Restaurant highlights"
              className="mt-9 grid gap-4 sm:grid-cols-2"
            >
              {highlights.map(({ value, label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex min-h-32 items-center gap-4 rounded-xl bg-cream p-5 shadow-md ring-1 ring-orange/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange/15 text-orange">
                    <Icon aria-hidden="true" className="text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="mt-1 text-sm font-medium text-gray-600">
                      {label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <AboutGallery />
    </div>
  )
}

export default About

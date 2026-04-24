import pizzaJpeg from '../assets/images/pizza.jpeg'
import ig from '../assets/images/ig.png'
import { useNews } from '@/hooks/public/useNews'

function Home() {
  const { data: news, isLoading, isError } = useNews()

  return (
    <div className="flex flex-col">
      
      {/* Image Container with Text Overlay */}
      <div className="w-full mb-8 md:mb-12 relative overflow-hidden">
        <img 
          src={pizzaJpeg} 
          alt="Delicious pizza" 
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/30 flex flex-col justify-center items-start p-6 md:p-12 z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-orange mb-4 md:mb-6">
            Hot, fresh pizza made just the way you love it.
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-orange">
            Real ingredients. Real pizza. Real good.
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mb-12 items-stretch">
        
        <div className="flex flex-col">
          <h2 className="underline underline-offset-6 text-orange text-center font-bold text-xl md:text-2xl mb-4">
            News
          </h2>
          <div className="bg-gray-700 p-6 rounded-lg flex-1">
            {isLoading && <p className="text-orange">Loading news...</p>}
            {isError && <p className="text-orange">Failed to load news.</p>}
            {news?.map((item) => (
              <div key={item.id}>
                <h2 className="text-orange p-3 font-bold text-xl md:text-2xl mb-4">
                  {new Date(item.date).toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric'
                  })}
                  <hr />
                </h2>
                <p className="text-orange pl-3 pr-3 text-sm md:text-base grow">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      
        <div className="flex flex-col">
          <h2 className="underline underline-offset-6 text-orange text-center font-bold text-xl md:text-2xl mb-4">
            Why Choose Us
          </h2>
          <div className="bg-gray-700 p-6 rounded-lg flex-1">
            <p className="text-orange text-sm md:text-base">
              We use real ingredients, traditional recipes and bake every pizza fresh.
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="underline underline-offset-6 text-orange text-center font-bold text-xl md:text-2xl mb-4">
            Social Media
          </h2>
          <div className="bg-gray-700 p-6 rounded-lg flex-1">
            <p className="text-orange font-bold text-sm text-center md:text-base">
              Follow us on Instagram for weekly offers and new pizza launches!
            </p>
            <img
              src={ig}
              alt="Instagram"
              className="mt-5 rounded-lg mx-auto block"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
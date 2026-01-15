import pizzaJpeg from '../assets/images/pizza.jpeg'

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Image Container with Text Overlay */}
      <div className="w-full mb-8 md:mb-12 relative overflow-hidden rounded-lg">
        {/* Image */}
        <img 
          src={pizzaJpeg} 
          alt="Delicious pizza" 
          className="w-full h-64 md:h-96 object-cover"
        />
        
        {/* Text overlay - positioned on top of image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex flex-col justify-center items-start p-6 md:p-12 z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-orange mb-4 md:mb-6">
            Hot, fresh pizza made just the way you love it.
          </h1>
          
          <h1 className="text-2xl md:text-4xl font-bold text-orange">
            Real ingredients. Real pizza. Real good.
          </h1>
        </div>
      </div>
        </div>
  )
}

export default Home
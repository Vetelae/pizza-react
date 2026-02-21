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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mb-12 items-stretch">
        <div className="flex flex-col">
    <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-4">
      News
    </h2>

    <div className="bg-orange p-6 rounded-lg">
        <h2 className="text-black p-3 font-bold text-xl md:text-2xl mb-4">
          Friday 20.2.2026
          <hr></hr>
        </h2>
        <p className="text-black pl-3 pr-3 text-sm md:text-base grow">
          This Friday is all about pizza! Join us for our special Pizza Friday where all large pizzas are -20% all day long. Bring your friends, family, or coworkers and enjoy your favorite flavors fresh from the oven.
          Dine in or order takeaway – the discount applies to both. Make your Friday delicious and start the weekend the right way with hot, cheesy pizza!
          </p>
  
        <h2 className="text-black p-3 font-bold text-xl md:text-2xl mb-4">
          Friday 13.2.2026
          <hr></hr>
        </h2>
        <p className="text-black pl-3 text-sm md:text-base grow">
          Our popular pizza buffet is back this weekend! Enjoy unlimited slices of our most loved pizzas, including classic Margherita, Pepperoni, BBQ Chicken, and vegetarian options.
          The buffet includes fresh salad, sauces, and soft drinks. Perfect for families and groups who want to taste a little bit of everything. Come hungry and leave happy!
          </p>

        <h2 className="text-black p-3 pr-3 font-bold text-xl md:text-2xl mb-4">
          Friday 6.2.2026
          <hr></hr>
        </h2>
        <p className="text-black pl-3 pr-3 text-sm md:text-base grow">
          We’re excited to introduce our new Flavor of the Month! This special pizza combines creamy mozzarella, spicy chorizo, roasted peppers, red onion, and a touch of garlic oil for the perfect balance of heat and flavor.
          Available for a limited time only, so don’t miss your chance to try it. Stop by this weekend and discover your new favorite pizza!
          </p>
      </div>
      </div>
      
      <div className="flex flex-col">
    <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-4">
      Why Choose Us
    </h2>

    <div className="bg-orange p-6 rounded-lg flex-1">
      <p className="text-black text-sm md:text-base">
        We use real ingredients, traditional recipes and bake every pizza fresh.
      </p>
    </div>
  </div>

  <div className="flex flex-col">
    <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-4">
      Social Media
    </h2>

    <div className="bg-orange p-6 rounded-lg flex-1">
      <p className="text-black text-sm md:text-base">
        Follow us on Instagram and Facebook for weekly offers and new pizza launches.
      </p>
    </div>
  </div>
</div>
</div>
  )
}

export default Home
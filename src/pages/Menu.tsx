import margherita from '../assets/images/margherita.png'
import hawaii from '../assets/images/hawaii.png'
import kebab from '../assets/images/kebab.png'
import veggie from '../assets/images/veggie.png'
import pepperoni from '../assets/images/pepperoni.png'
import bbqchicken from '../assets/images/bbqchicken.png'

function Menu() {
  return (
    <div className="min-h-screen mt-15">
        <h2 className="text-4xl font-bold text-center mb-5 text-orange">
          Pizzas
    </h2> 
    <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          
          <div className="bg-orange rounded-lg border-2 border-black shadow-mds p-6 flex flex-col">
            <h2 className="text-black font-bold text-xl md:text-2xl mb-4">Margherita #1</h2>
            <p className="text-black text-sm md:text-base grow">
              Classic and simple with rich tomato sauce, fresh mozzarella, and fragrant basil.
            </p>
            <h2 className="text-night text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">8.99$</h2>
            <img
            src={margherita}
            alt="Margherita pizza"
            className="mt-1 rounded-lg"
            />
            <button className="mt-5 bg-night text-orange">Order now!</button>
          </div>
          
          <div className="bg-orange rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-black font-bold text-xl md:text-2xl mb-4">Hawaii #2</h2>
            <p className="text-black text-sm md:text-base grow">
              Tomato sauce, mozzarella, sweet pineapple, and savory ham for a sweet-savory combo.
            </p>
            <h2 className="text-night text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">9.99$</h2>
            <img
            src={hawaii}
            alt="Hawaii pizza"
            className="mt-3 rounded-lg"
            />
            <button className="mt-5 bg-night text-orange">Order now!</button>
          </div>
          
          <div className="bg-orange rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-black font-bold text-xl md:text-2xl mb-4">Kebab #3</h2>
            <p className="text-black text-sm md:text-base grow">
              Tomato sauce, mozzarella, seasoned kebab meat, topped with onions and a drizzle of garlic sauce.
            </p>
            <h2 className="text-night text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">10.99$</h2>
            <img
            src={kebab}
            alt="Kebab pizza"
            className="mt-3 rounded-lg"
            />
            <button className="mt-5 bg-night text-orange">Order now!</button>
          </div>

          <div className="bg-orange rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-black font-bold text-xl md:text-2xl mb-4">Veggie #4</h2>
            <p className="text-black text-sm md:text-base grow">
              A colorful mix of fresh vegetables, melted mozzarella, and savory tomato sauce on a crispy crust.
            </p>
            <h2 className="text-night text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">9.99$</h2>
            <img
            src={veggie}
            alt="Veggie pizza"
            className="mt-3 rounded-lg"
            />
            <button className="mt-5 bg-night text-orange">Order now!</button>
          </div>
          
          <div className="bg-orange rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-black font-bold text-xl md:text-2xl mb-4">Pepperoni #5</h2>
            <p className="text-black text-sm md:text-base grow">
              Classic tomato sauce, melted mozzarella, and plenty of spicy pepperoni slices.
            </p>
            <h2 className="text-night text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">10.99$</h2>
            <img
            src={pepperoni}
            alt="Pepperoni pizza"
            className="mt-3 rounded-lg"
            />
            <button className="mt-5 bg-night text-orange">Order now!</button>
          </div>
          
          <div className="bg-orange rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-black font-bold text-xl md:text-2xl mb-4">BBQ Chicken #6</h2>
            <p className="text-black text-sm md:text-base grow">
              Tender chicken, smoky BBQ sauce, red onions, and gooey cheese for a sweet-savory bite.
            </p>
            <h2 className="text-night text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">10.99$</h2>
            <img
            src={bbqchicken}
            alt="BBQ chicken pizza"
            className="mt-3 rounded-lg"
            />
            <button className="mt-5 bg-night text-orange">Order now!</button>
    </div>
    </div>
    </div>
    </div>
  )
}

export default Menu
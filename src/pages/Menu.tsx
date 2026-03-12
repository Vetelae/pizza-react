import { useMenuItems } from '../hooks/useMenuItems'
import pizzaCategory from '../assets/images/pizzaCategory.png'
import kebabCategory from '../assets/images/kebabCategory.png'
import saladCategory from '../assets/images/saladCategory.png'
import sidesCategory from '../assets/images/sidesCategory.png'
import drinkCategory from '../assets/images/drinkCategory.png'

function Menu() {
  const { data: menuItems, isLoading, isError } = useMenuItems()

  return (
    <div className="min-h-screen mt-10">
      <h2 className="underline underline-offset-4 text-4xl font-bold text-center mb-5 text-orange">
          Choose Category
      </h2>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 mb-2 md:grid-cols-5 gap-8 w-full max-w-2xl">
          <div className="bg-powder p-3 flex flex-col">
           <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-2">Pizzas</h2>
              <img src={pizzaCategory} alt="Pizzas" className="mt-1 border border-orange rounded-lg w-48 mx-auto md:w-full" />
          </div>
           <div className="bg-powder p-3 flex flex-col">
            <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-2">Kebabs</h2>
            <img src={kebabCategory} alt="Kebabs" className="mt-1 border border-orange rounded-lg w-48 mx-auto md:w-full" />
          </div>
           <div className="bg-powder p-3 flex flex-col">
            <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-2">Salads</h2>
            <img src={saladCategory} alt="Salads" className="mt-1 border border-orange rounded-lg w-48 mx-auto md:w-full" />
          </div>
          <div className="bg-powder p-3 flex flex-col">
            <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-2">Sides</h2>
            <img src={sidesCategory} alt="Sides" className="mt-1 border border-orange rounded-lg w-48 mx-auto md:w-full" />
          </div>
          <div className="bg-powder p-3 flex flex-col">
            <h2 className="text-orange text-center font-bold text-xl md:text-2xl mb-2">Drinks</h2>
            <img src={drinkCategory} alt="Drinks" className="mt-1 border border-orange rounded-lg w-48 mx-auto md:w-full" />
          </div>
        </div>
      </div>

      <hr className="h-px mt-10 mb-15 bg-orange border-0" />
    
      <div className="min-h-screen mt-5">
        <h2 className="underline underline-offset-4 text-4xl font-bold text-center mb-8 text-orange">
          Pizzas
        </h2>
 
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 mb-12 md:grid-cols-4 gap-6 w-full max-w-6xl">
            
            {isLoading && <p className="text-orange">Loading menu...</p>}
            {isError && <p className="text-orange">Failed to load menu.</p>}
            {menuItems?.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-orange font-bold text-xl md:text-2xl mb-4">{item.name}</h2>
                <p className="text-orange text-sm md:text-base grow">{item.description}</p>
                <h2 className="text-orange text-shadow-md text-shadow-glow text-xl md:text-2xl text-center mt-4">
                  {item.price}$
                </h2>
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${item.imagePath}`}
                  alt={item.name}
                  className="mt-3 border border-orange rounded-lg w-48 mx-auto md:w-full"
                />
                <button className="mt-5 bg-gray-900 text-orange">Order now!</button>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
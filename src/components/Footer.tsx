const Footer = () => {
  return (
    <footer className="mt-auto border-t border-orange/30 bg-gray-950 py-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 md:px-10">
        <div>
          <h2 className="text-lg font-bold text-orange">Pizza Shop</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Fresh pizza, made your way.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-cream">Opening hours</h2>
          <p className="mt-2 text-sm text-gray-400">
            Monday–Friday: 11:00–22:00
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Saturday–Sunday: 12:00–23:00
          </p>
        </div>
        <div>
          <h2 className="font-bold text-cream">Contact</h2>
          <address className="mt-2 text-sm not-italic text-gray-400">
            <p>123 Pizza St.</p>
            <a
              href="mailto:info@pizzashop.com"
              className="mt-1 inline-block transition-colors hover:text-orange"
            >
              info@pizzashop.com
            </a>
          </address>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 px-6 pt-6 text-sm text-gray-500 md:px-10">
        © {new Date().getFullYear()} Pizza Shop. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

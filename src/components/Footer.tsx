const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-2">🍕 Pizza Shop</h3>
          <p className="text-gray-400 text-sm">Best pizza in town.</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Hours</h3>
          <p className="text-gray-400 text-sm">Mon–Fri: 11am – 10pm</p>
          <p className="text-gray-400 text-sm">Sat–Sun: 12pm – 11pm</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p className="text-gray-400 text-sm">123 Pizza St.</p>
          <p className="text-gray-400 text-sm">info@pizzashop.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
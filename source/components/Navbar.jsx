function Navbar() {
    return (
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          <span className="text-white text-xl font-semibold">Topflow</span>
        </div>
  
        <div className="flex gap-12 text-white">
          <a href="#models" className="hover:text-gray-300 transition">
            Models
          </a>
          <a href="#accuracy" className="hover:text-gray-300 transition">
            Accuracy
          </a>
          <a href="#data" className="hover:text-gray-300 transition">
            Data
          </a>
          <a href="#about" className="hover:text-gray-300 transition">
            About
          </a>
        </div>
      </nav>
    );
  }
  
  export default Navbar;
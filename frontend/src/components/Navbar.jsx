import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          onClick={closeMenu}
          className="text-2xl font-bold text-blue-600"
        >
          Rohan.
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-gray-700 transition hover:text-blue-600">
            Home
          </a>

          <a href="#about" className="text-gray-700 transition hover:text-blue-600">
            About
          </a>

          <a href="#skills" className="text-gray-700 transition hover:text-blue-600">
            Skills
          </a>

          <a href="#projects" className="text-gray-700 transition hover:text-blue-600">
            Projects
          </a>

          <a href="#experience" className="text-gray-700 transition hover:text-blue-600">
            Experience
          </a>

          <a href="#blog" className="text-gray-700 transition hover:text-blue-600">
            Blog
          </a>

          <a
            href="#contact"
            className="rounded-full bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Contact
          </a>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-gray-700 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-blue-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a onClick={closeMenu} href="#home" className="text-gray-700">
              Home
            </a>

            <a onClick={closeMenu} href="#about" className="text-gray-700">
              About
            </a>

            <a onClick={closeMenu} href="#skills" className="text-gray-700">
              Skills
            </a>

            <a onClick={closeMenu} href="#projects" className="text-gray-700">
              Projects
            </a>

            <a onClick={closeMenu} href="#experience" className="text-gray-700">
              Experience
            </a>

            <a onClick={closeMenu} href="#blog" className="text-gray-700">
              Blog
            </a>

            <a
              onClick={closeMenu}
              href="#contact"
              className="w-fit rounded-full bg-blue-600 px-5 py-2 text-white"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
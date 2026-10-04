function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Rohan Sharma. All rights reserved.
        </p>

        <a
          href="#home"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

export default Footer;
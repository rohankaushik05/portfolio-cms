function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-screen items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="mb-4 text-lg font-medium text-blue-600">
            Hello, I'm
          </p>

          <h1 className="text-5xl font-bold leading-tight text-gray-900 sm:text-6xl">
            Rohan Sharma
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl">
            Artificial Intelligence Engineer
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            I build intelligent, scalable and user-focused applications
            using modern web technologies and artificial intelligence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="rounded-full border border-blue-600 px-6 py-3 font-medium text-blue-600 transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
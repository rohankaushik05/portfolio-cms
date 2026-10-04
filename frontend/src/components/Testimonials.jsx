import { useEffect, useState } from "react";
import { getTestimonials } from "../services/api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();

        if (Array.isArray(data)) {
          setTestimonials(data);
        } else if (Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        } else if (Array.isArray(data.data)) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error("Testimonials fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="bg-blue-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">Testimonials</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            What People Say
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading testimonials...
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial._id}
                className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
              >
                <p className="leading-7 text-gray-600">
                  "{testimonial.message || testimonial.content}"
                </p>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>

                  {testimonial.role && (
                    <p className="text-sm text-blue-600">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
import { useEffect, useState } from "react";
import { getServices } from "../services/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();

        if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data.services)) {
          setServices(data.services);
        } else if (Array.isArray(data.data)) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Services fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">What I Do</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">Services</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading services...</p>
        ) : (
          <div className="flex justify-center">
            {services.map((service) => (
              <article
                key={service._id}
                className="w-full max-w-md rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {service.title || service.name}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;

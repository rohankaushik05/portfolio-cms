import { useEffect, useState } from "react";
import { getExperience } from "../services/api";

function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getExperience();

        if (Array.isArray(data)) {
          setExperience(data);
        } else if (Array.isArray(data.experiences)) {
          setExperience(data.experiences);
        } else if (Array.isArray(data.experience)) {
          setExperience(data.experience);
        } else if (Array.isArray(data.data)) {
          setExperience(data.data);
        } else {
          setExperience([]);
        }
      } catch (error) {
        console.error("Experience fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return (
    <section id="experience" className="bg-blue-50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">My Journey</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">Experience</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading experience...</p>
        ) : (
          <div className="space-y-6">
            {experience.map((item) => (
              <article
                key={item._id}
                className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.role}
                    </h3>

                    <p className="mt-1 font-medium text-blue-600">
                      {item.company}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {item.startDate} — {item.endDate || "Present"}
                  </p>
                </div>

                {item.location && (
                  <p className="mt-3 text-sm text-gray-500">{item.location}</p>
                )}

                <p className="mt-4 leading-7 text-gray-600">
                  {item.description}
                </p>

                {item.technologies?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.technologies.map((technology, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;

import { useEffect, useState } from "react";
import { getSkills } from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();

        if (Array.isArray(data)) {
          setSkills(data);
        } else if (Array.isArray(data.skills)) {
          setSkills(data.skills);
        } else if (Array.isArray(data.data)) {
          setSkills(data.data);
        }
      } catch (error) {
        console.error("Skills fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="bg-blue-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">My Skills</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Technologies I Work With
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-center text-gray-500">
            No skills available.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {skill.name}
                  </h3>

                  {skill.level && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
                      {skill.level}
                    </span>
                  )}
                </div>

                {skill.category && (
                  <p className="mt-2 text-sm text-gray-500">
                    {skill.category}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;
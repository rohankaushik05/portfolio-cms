import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();

        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else if (Array.isArray(data.data)) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Projects fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">My Work</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Featured Projects
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500">
            No projects available.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id}
                className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {project.image && (
                  <img
                    src={optimizeCloudinaryImage(project.image)}
                    alt={project.title}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {project.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {project.description}
                  </p>

                  {project.technologies?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((technology, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                      >
                        GitHub
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
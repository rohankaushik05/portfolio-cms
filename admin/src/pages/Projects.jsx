import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    order: 0,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok) {
          if (Array.isArray(data)) {
            setProjects(data);
          } else if (data && Array.isArray(data.projects)) {
            setProjects(data.projects);
          } else if (data && Array.isArray(data.data)) {
            setProjects(data.data);
          } else {
            setProjects([]);
          }
        } else {
          setMessage(data.message || "Failed to load projects");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Fetch projects error:", error);
          setMessage("Failed to load projects.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("accessToken");

    try {
      const url = editingId
        ? `${API_URL}/projects/${editingId}`
        : `${API_URL}/projects`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          technologies: form.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),
          order: Number(form.order),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save project");
      }

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );

      setEditingId(null);

      setForm({
        title: "",
        description: "",
        technologies: "",
        image: "",
        githubUrl: "",
        liveUrl: "",
        featured: false,
        order: 0,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
      order: project.order || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setMessage("Project deleted successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      technologies: "",
      image: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      order: 0,
    });

    setMessage("");
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-600 font-medium">
        Loading projects...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Projects
      </h1>

      <p className="text-gray-500 mt-2 mb-6">
        Manage your portfolio projects.
      </p>

      {/* Project Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm mb-8 max-w-4xl"
      >
        <h2 className="text-xl font-semibold mb-5">
          {editingId ? "Edit Project" : "Add Project"}
        </h2>

        <div className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project title"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project description"
            rows="5"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="Technologies e.g. React, Node.js, MongoDB"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Project image URL"
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="border rounded-lg px-4 py-3"
            />

            <input
              name="liveUrl"
              value={form.liveUrl}
              onChange={handleChange}
              placeholder="Live project URL"
              className="border rounded-lg px-4 py-3"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label>Featured Project</label>
          </div>

          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            placeholder="Display order"
            className="border rounded-lg px-4 py-3"
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p className="mt-4 text-sm text-blue-600">
            {message}
          </p>
        )}
      </form>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Existing Projects
          </h2>
        </div>

        {projects.length === 0 ? (
          <p className="p-6 text-gray-500">
            No projects found.
          </p>
        ) : (
          <div className="divide-y">
            {projects.map((project) => (
              <div
                key={project._id || project.title}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(" • ")
                      : ""}
                  </p>

                  {project.featured && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;

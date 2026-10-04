import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    technologies: "",
    order: 0,
  });

  const [message, setMessage] = useState("");

  // Fetch Experience Data
  useEffect(() => {
    let isMounted = true;

    const fetchExperienceData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(`${API_URL}/experience`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok) {
          if (Array.isArray(data)) {
            setExperiences(data);
          } else if (data && Array.isArray(data.experiences)) {
            setExperiences(data.experiences);
          } else if (data && Array.isArray(data.data)) {
            setExperiences(data.data);
          } else {
            setExperiences([]);
          }
        } else {
          setMessage(data.message || "Failed to load experience.");
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch experience error:", err);
          setMessage("Failed to load experience. Ensure backend is running.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExperienceData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      company: exp.company || "",
      role: exp.role || exp.title || "",
      description: exp.description || "",
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      location: exp.location || "",
      technologies: Array.isArray(exp.technologies)
        ? exp.technologies.join(", ")
        : exp.technologies || "",
      order: exp.order ?? 0,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      company: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      technologies: "",
      order: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("Please log in again.");
      return;
    }

    // Format technologies string into array if backend expects array
    const techArray = form.technologies
      ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      location: form.location.trim(),
      technologies: techArray,
      order: Number(form.order) || 0,
    };

    if (form.endDate) {
      payload.endDate = form.endDate;
    }

    const url = editingId
      ? `${API_URL}/experience/${editingId}`
      : `${API_URL}/experience`;

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 401 || data.message?.toLowerCase().includes("token")) {
        localStorage.removeItem("accessToken");
        setMessage("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Validation failed on server.");
      }

      setMessage(
        editingId
          ? "Experience updated successfully."
          : "Experience added successfully."
      );

      setEditingId(null);
      setForm({
        company: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        technologies: "",
        order: 0,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience entry?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || data.message?.toLowerCase().includes("token")) {
        localStorage.removeItem("accessToken");
        setMessage("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete experience");
      }

      setMessage("Experience deleted successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-600 font-medium">
        Loading experience entries...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {editingId ? "Edit Experience" : "Add Experience"}
      </h1>

      {/* Experience Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <input
            type="text"
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="Technologies"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            className="w-32 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? "Update Experience" : "Add Experience"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p
            className={`mt-3 text-sm font-medium ${
              message.startsWith("Error") ? "text-red-600" : "text-blue-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {/* Existing Experience List */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Existing Experience
        </h2>

        {!Array.isArray(experiences) || experiences.length === 0 ? (
          <p className="text-gray-500">No experience found.</p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp._id || exp.company}
                className="bg-white border rounded-xl p-5 flex items-start justify-between shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {exp.role || exp.title}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {exp.startDate ? exp.startDate.split("T")[0] : ""} —{" "}
                    {exp.endDate ? exp.endDate.split("T")[0] : "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(Array.isArray(exp.technologies)
                        ? exp.technologies
                        : [exp.technologies]
                      ).map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(exp)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
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

export default Experience;
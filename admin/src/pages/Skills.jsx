import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
    icon: "",
    order: 0,
  });

  const [message, setMessage] = useState("");

  // Fetch Skills with Authorization Header
  useEffect(() => {
    let isMounted = true;

    const fetchSkillsData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(`${API_URL}/skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok) {
          if (Array.isArray(data)) {
            setSkills(data);
          } else if (data && Array.isArray(data.skills)) {
            setSkills(data.skills);
          } else if (data && Array.isArray(data.data)) {
            setSkills(data.data);
          } else {
            setSkills([]);
          }
        } else {
          setMessage(data.message || "Failed to load skills.");
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch skills error:", err);
          setMessage("Failed to load skills. Ensure backend is running.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSkillsData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "",
      icon: skill.icon || "",
      order: skill.order || 0,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      level: "",
      icon: "",
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

    const url = editingId
      ? `${API_URL}/skills/${editingId}`
      : `${API_URL}/skills`;

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          order: Number(form.order),
        }),
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
        throw new Error(data.message || "Failed to save skill");
      }

      setMessage(
        editingId
          ? "Skill updated successfully."
          : "Skill added successfully."
      );

      setEditingId(null);
      setForm({ name: "", category: "", level: "", icon: "", order: 0 });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/skills/${id}`, {
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
        throw new Error(data.message || "Failed to delete skill");
      }

      setMessage("Skill deleted successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-600 font-medium">
        Loading skills...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Skills</h1>
      <p className="text-gray-500 mt-2 mb-6">Manage your technical skills.</p>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm mb-8 max-w-3xl"
      >
        <h2 className="text-xl font-semibold mb-5">
          {editingId ? "Edit Skill" : "Add Skill"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Skill name"
            className="border rounded-lg px-4 py-3"
            required
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border rounded-lg px-4 py-3"
            required
          />

          <input
            name="level"
            value={form.level}
            onChange={handleChange}
            placeholder="Level e.g. Advanced"
            className="border rounded-lg px-4 py-3"
            required
          />

          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="Icon"
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            placeholder="Order"
            className="border rounded-lg px-4 py-3"
          />
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {editingId ? "Update Skill" : "Add Skill"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p className="mt-4 text-sm text-blue-600">{message}</p>
        )}
      </form>

      {/* Skills List UI */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Existing Skills</h2>
        </div>

        {!Array.isArray(skills) || skills.length === 0 ? (
          <p className="p-6 text-gray-500">No skills found.</p>
        ) : (
          <div className="divide-y">
            {skills.map((skill) => (
              <div
                key={skill._id || skill.name}
                className="p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {skill.category} • {skill.level}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(skill)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(skill._id)}
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

export default Skills;

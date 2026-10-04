import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    image: "",
    order: 0,
  });

  const [message, setMessage] = useState("");

  // Fetch Testimonials Data
  useEffect(() => {
    let isMounted = true;

    const fetchTestimonialsData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(`${API_URL}/testimonials`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok) {
          if (Array.isArray(data)) {
            setTestimonials(data);
          } else if (data && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          } else if (data && Array.isArray(data.data)) {
            setTestimonials(data.data);
          } else {
            setTestimonials([]);
          }
        } else {
          setMessage(data.message || "Failed to load testimonials.");
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch testimonials error:", err);
          setMessage("Failed to load testimonials. Ensure backend is running.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTestimonialsData();

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

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      role: item.role || item.position || "",
      company: item.company || "",
      content: item.content || item.testimonial || item.message || "",
      image: item.image || item.avatar || "",
      order: item.order ?? 0,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      role: "",
      company: "",
      content: "",
      image: "",
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

    const trimmedContent = form.content.trim();
    const trimmedRole = form.role.trim();

    // Payload sending aliases to satisfy any Mongoose Schema key configuration
    const payload = {
      name: form.name.trim(),
      role: trimmedRole,
      position: trimmedRole,
      company: form.company.trim(),
      content: trimmedContent,
      testimonial: trimmedContent,
      message: trimmedContent,
      image: form.image.trim(),
      order: Number(form.order) || 0,
    };

    const url = editingId
      ? `${API_URL}/testimonials/${editingId}`
      : `${API_URL}/testimonials`;

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
        // Capture detailed backend error messages if available
        const errorDetails = data.errors
          ? Object.values(data.errors).map((e) => e.message || e).join(", ")
          : data.message;
        throw new Error(errorDetails || "Validation failed on server.");
      }

      setMessage(
        editingId
          ? "Testimonial updated successfully."
          : "Testimonial added successfully."
      );

      setEditingId(null);
      setForm({
        name: "",
        role: "",
        company: "",
        content: "",
        image: "",
        order: 0,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
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
        throw new Error(data.message || "Failed to delete testimonial");
      }

      setMessage("Testimonial deleted successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-600 font-medium">
        Loading testimonials...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
      <p className="text-gray-500 mt-1 mb-4">Manage portfolio testimonials.</p>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.startsWith("Error") ? "text-red-600" : "text-blue-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4"
      >
        <div>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Software Engineer"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="ABC Technologies"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Great developer with excellent problem-solving skills."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Testimonial List */}
      <div className="pt-2">
        {!Array.isArray(testimonials) || testimonials.length === 0 ? (
          <p className="text-gray-500">No testimonials found.</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div
                key={item._id || item.name}
                className="bg-white border rounded-xl p-5 flex items-start justify-between shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm font-medium text-blue-600">
                      {item.role || item.position} {item.company ? `at ${item.company}` : ""}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      "{item.content || item.testimonial || item.message}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
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

export default Testimonials;
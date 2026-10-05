import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0,
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      icon: "",
      order: 0,
    });
    setEditingId(null);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data.services)) {
          setServices(data.services);
        } else if (Array.isArray(data.data)) {
          setServices(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [refreshKey]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    try {
      const url = editingId
        ? `${API_URL}/services/${editingId}`
        : `${API_URL}/services`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage(
        editingId
          ? "Service updated successfully"
          : "Service created successfully"
      );

      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);

    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      order: service.order || 0,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Service deleted successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Services</h1>

      <p className="mt-2 text-gray-500">
        Manage portfolio services.
      </p>

      {message && (
        <p className="mt-4 text-blue-600">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <input
          name="title"
          placeholder="Service Title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded border p-2"
          rows="4"
          required
        />

        <input
          name="icon"
          placeholder="Icon"
          value={form.icon}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <input
          name="order"
          type="number"
          placeholder="Order"
          value={form.order}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {editingId ? "Update Service" : "Add Service"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded bg-gray-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-500">No services found.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-lg bg-white p-5 shadow"
              >
                <h2 className="text-xl font-semibold">
                  {service.title}
                </h2>

                <p className="mt-2 text-gray-700">
                  {service.description}
                </p>

                {service.icon && (
                  <p className="mt-2 text-sm text-gray-500">
                    Icon: {service.icon}
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="rounded bg-yellow-500 px-4 py-2 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(service._id)}
                    className="rounded bg-red-600 px-4 py-2 text-white"
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

export default Services;

    import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function About() {
  const [form, setForm] = useState({
    title: "",
    bio: "",
    profileImage: "",
    resumeUrl: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/about`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setForm({
            title: data.title || "",
            bio: data.bio || "",
            profileImage: data.profileImage || "",
            resumeUrl: data.resumeUrl || "",
            location: data.location || "",
          });
        }
      })
      .catch(() => {
        setMessage("Failed to load About data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setMessage("About section updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800">
        About
      </h1>

      <p className="text-gray-500 mt-2 mb-6">
        Manage your portfolio About section.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm space-y-5"
      >
        <div>
          <label className="block font-medium mb-2">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="About Me"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="6"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Write your bio..."
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Profile Image URL
          </label>
          <input
            name="profileImage"
            value={form.profileImage}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Resume URL
          </label>
          <input
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Your location"
          />
        </div>

        {message && (
          <p className="text-sm text-blue-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default About;
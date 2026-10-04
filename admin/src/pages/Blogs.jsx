import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    published: false,
    publishedAt: "",
    order: 0,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs`);
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok) {
          if (Array.isArray(data)) {
            setBlogs(data);
          } else if (data && Array.isArray(data.blogs)) {
            setBlogs(data.blogs);
          } else if (data && Array.isArray(data.data)) {
            setBlogs(data.data);
          } else {
            setBlogs([]);
          }
        } else {
          setMessage(data.message || "Failed to load blogs");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Fetch blogs error:", error);
          setMessage("Failed to load blogs.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

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

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: "",
      published: false,
      publishedAt: "",
      order: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("accessToken");

    try {
      const url = editingId
        ? `${API_URL}/blogs/${editingId}`
        : `${API_URL}/blogs`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          order: Number(form.order),
          publishedAt: form.publishedAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save blog");
      }

      setMessage(
        editingId
          ? "Blog updated successfully."
          : "Blog created successfully."
      );

      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);

    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      tags: Array.isArray(blog.tags)
        ? blog.tags.join(", ")
        : "",
      published: blog.published || false,
      publishedAt: blog.publishedAt
        ? blog.publishedAt.slice(0, 16)
        : "",
      order: blog.order || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog");
      }

      setMessage("Blog deleted successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-600 font-medium">
        Loading blogs...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Blogs
      </h1>

      <p className="text-gray-500 mt-2 mb-6">
        Manage your portfolio blog posts.
      </p>

      {/* Blog Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm mb-8 max-w-4xl"
      >
        <h2 className="text-xl font-semibold mb-5">
          {editingId ? "Edit Blog" : "Add Blog"}
        </h2>

        <div className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Blog title"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="blog-slug"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Short excerpt"
            rows="3"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Blog content"
            rows="8"
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="Cover image URL"
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags e.g. React, Node.js, AI"
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label>Published</label>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Published Date
            </label>

            <input
              type="datetime-local"
              name="publishedAt"
              value={form.publishedAt}
              onChange={handleChange}
              className="border rounded-lg px-4 py-3"
            />
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
            {editingId ? "Update Blog" : "Add Blog"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
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

      {/* Blog List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Existing Blogs
          </h2>
        </div>

        {blogs.length === 0 ? (
          <p className="p-6 text-gray-500">
            No blogs found.
          </p>
        ) : (
          <div className="divide-y">
            {blogs.map((blog) => (
              <div
                key={blog._id || blog.slug}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    /{blog.slug}
                  </p>

                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      blog.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {blog.published
                      ? "Published"
                      : "Draft"}
                  </span>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(blog)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(blog._id)}
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

export default Blogs;
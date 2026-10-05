import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Media() {
  const [media, setMedia] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchMedia = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/media`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch media");
    }

    setMedia(Array.isArray(data) ? data : data.media || []);
  } catch (error) {
    setMessage(error.message || "Failed to fetch media");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  let ignore = false;

  const loadInitialMedia = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch media");
      }

      if (!ignore) {
        setMedia(Array.isArray(data) ? data : data.media || []);
      }
    } catch (error) {
      if (!ignore) {
        setMessage(error.message || "Failed to fetch media");
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadInitialMedia();

  return () => {
    ignore = true;
  };
}, []);
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage("Please select an image");
      return;
    }

    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("Image uploaded successfully");
      setSelectedFile(null);

      document.getElementById("media-file").value = "";

      fetchMedia();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/media/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Media deleted successfully");

      fetchMedia();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Media
      </h1>

      <p className="mt-2 text-gray-500">
        Upload and manage your portfolio images.
      </p>

      {message && (
        <p className="mt-4 text-blue-600">
          {message}
        </p>
      )}

      <form
        onSubmit={handleUpload}
        className="mt-6 rounded-lg bg-white p-6 shadow"
      >
        <input
          id="media-file"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full rounded border p-2"
        />

        <button
          type="submit"
          className="mt-4 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Upload Image
        </button>
      </form>

      <div className="mt-8">
        {loading ? (
          <p>Loading media...</p>
        ) : media.length === 0 ? (
          <p className="text-gray-500">
            No media uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <img
                  src={item.url}
                  alt={item.filename}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <p className="truncate font-medium">
                    {item.filename}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.type}
                  </p>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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

export default Media;

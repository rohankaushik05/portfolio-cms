import { useEffect, useState } from "react";
import { getBlogs } from "../services/api";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();

        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else if (Array.isArray(data.data)) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Blogs fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">My Blog</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Latest Articles
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {blog.coverImage && (
                  <img
                    src={optimizeCloudinaryImage(blog.coverImage)}
                    alt={blog.title}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="mt-3 leading-7 text-gray-600">
                      {blog.excerpt}
                    </p>
                  )}

                  {blog.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {blog.publishedDate && (
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </p>
                  )}
    
                  {blog.content && (
                    <p className="mt-3 leading-7 text-gray-600">
                      {blog.content}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Blog;

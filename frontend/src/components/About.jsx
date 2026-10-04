import { useEffect, useState } from "react";
import { getAbout } from "../services/api";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAbout();
        setAbout(data.about);
      } catch (error) {
        console.error("About fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section id="about" className="px-6 py-24">
        <p className="text-center text-gray-500">Loading...</p>
      </section>
    );
  }

  if (!about) {
    return null;
  }

  return (
    <section id="about" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">About Me</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            {about.title}
          </h2>
        </div>

        {about.profileImage && (
          <div className="mb-10 flex justify-center">
            <img
              src={optimizeCloudinaryImage(about.profileImage)}
              alt={about.title || "Rohan Sharma"}
              className="h-64 w-64 rounded-2xl object-cover shadow-md"
            />
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <p className="text-center text-lg leading-8 text-gray-600">
            {about.bio}
          </p>

          {about.location && (
            <p className="mt-6 text-center text-gray-500">
              📍 {about.location}
            </p>
          )}

          {about.resumeUrl && (
            <div className="mt-8 text-center">
              <a
                href={about.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;

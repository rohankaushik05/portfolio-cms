import { useState } from "react";
import { createContact } from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await createContact(formData);

      setStatus("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact error:", error);
      setStatus(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-blue-50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="font-medium text-blue-600">Get In Touch</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Contact Me
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Have a project, opportunity, or question? Send me a message.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="6"
            required
            className="mt-6 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-full bg-blue-600 px-7 py-3 font-medium text-white transition hover:-translate-y-1 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && (
            <p className="mt-4 text-sm text-gray-600">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
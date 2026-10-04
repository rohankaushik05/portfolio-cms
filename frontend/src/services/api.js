const API_URL = "http://localhost:5000/api";

const getData = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return response.json();
};

export const getAbout = () => getData("/about");

export const getSkills = () => getData("/skills");

export const getProjects = () => getData("/projects");

export const getExperience = () => getData("/experience");

export const getServices = () => getData("/services");

export const getTestimonials = () => getData("/testimonials");

export const getBlogs = () => getData("/blogs");

export const createContact = async (contactData) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send message");
  }

  return data;
};
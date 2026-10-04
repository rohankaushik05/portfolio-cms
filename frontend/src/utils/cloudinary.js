export const optimizeCloudinaryImage = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto/"
  );
};
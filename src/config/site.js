export const site = {
  name: "Urban Company",
  tagline: "Home services at your doorstep",
  defaultCity: "Delhi NCR",
  currency: "INR",
};

export const asset = (name) => {
  if (!name) return "";

  // Admin-uploaded Cloudinary image
  if (/^https?:\/\//i.test(name)) {
    return name;
  }

  // Existing images in client/public/assets
  return `/assets/${name}`;
};

export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

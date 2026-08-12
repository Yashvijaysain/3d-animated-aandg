export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  project?: string;
  location?: string;
  rating: number;
  review: string;
  featured?: boolean;
};

// Replace all placeholder reviews with verified client testimonials before launch.
export const testimonials: Testimonial[] = [
  {
    id: "testimonial-01",
    name: "Verified Client",
    project: "A&G Advisory",
    location: "Noida",
    rating: 5,
    review:
      "Replace this placeholder with a verified client testimonial before production.",
    featured: true,
  },
  {
    id: "testimonial-02",
    name: "Verified Client",
    project: "A&G Realtors",
    location: "Noida",
    rating: 5,
    review:
      "Replace this placeholder with a verified client testimonial before production.",
  },
  {
    id: "testimonial-03",
    name: "Verified Client",
    project: "Residential Advisory",
    location: "Noida",
    rating: 5,
    review:
      "Replace this placeholder with a verified client testimonial before production.",
  },
  {
    id: "testimonial-04",
    name: "Verified Client",
    project: "Property Consultation",
    location: "Noida",
    rating: 5,
    review:
      "Replace this placeholder with a verified client testimonial before production.",
  },
  {
    id: "testimonial-05",
    name: "Verified Client",
    project: "A&G Client Care",
    location: "Noida",
    rating: 5,
    review:
      "Replace this placeholder with a verified client testimonial before production.",
  },
];

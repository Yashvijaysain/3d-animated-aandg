export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  projectName: string;
  projectSlug: string;
  category:
    | "Exterior"
    | "Interior"
    | "Landscape"
    | "Amenities"
    | "Lifestyle";
};

export const projectGallery: GalleryImage[] = [
  {
    id: "ivory-banner",
    src: "/project-details/IVORY BANNER.webp",
    alt: "Ivory County contemporary residential exterior",
    projectName: "Ivory County",
    projectSlug: "ivory-county",
    category: "Exterior"
  },
  {
    id: "jade-aerial-garden",
    src: "/project-details/jade ariel garden.jpg",
    alt: "Jade County landscaped aerial garden view",
    projectName: "Jade County",
    projectSlug: "jade-county",
    category: "Landscape"
  },
  {
    id: "ivy-interior",
    src: "/project-details/ivy inside.webp",
    alt: "Ivy County refined residential interior",
    projectName: "Ivy County",
    projectSlug: "ivy-county",
    category: "Interior"
  },
  {
    id: "county-107-balcony",
    src: "/project-details/107 balcony view.jpg",
    alt: "County 107 balcony view from a residence",
    projectName: "County 107",
    projectSlug: "county-107",
    category: "Lifestyle"
  },
  {
    id: "clove-garden",
    src: "/project-details/clove garden.webp",
    alt: "Clove County lush garden pocket",
    projectName: "Clove County",
    projectSlug: "clove-county",
    category: "Landscape"
  },
  {
    id: "jade-sitting",
    src: "/project-details/jade sitting.jpg",
    alt: "Jade County outdoor sitting amenity",
    projectName: "Jade County",
    projectSlug: "jade-county",
    category: "Amenities"
  },
  {
    id: "ivory-garden",
    src: "/project-details/ivory garden.webp",
    alt: "Ivory County residential garden and arrival landscape",
    projectName: "Ivory County",
    projectSlug: "ivory-county",
    category: "Landscape"
  },
  {
    id: "county-courtyard",
    src: "/project-details/countycourtyard.webp",
    alt: "County 107 courtyard amenity space",
    projectName: "County 107",
    projectSlug: "county-107",
    category: "Amenities"
  },
  {
    id: "clove-building",
    src: "/project-details/clove building.webp",
    alt: "Clove County warm residential building facade",
    projectName: "Clove County",
    projectSlug: "clove-county",
    category: "Exterior"
  },
  {
    id: "cleo-building",
    src: "/project-details/cleo building.jpg",
    alt: "Cleo County Egyptian-inspired residential exterior",
    projectName: "Cleo County",
    projectSlug: "cleo-county",
    category: "Exterior"
  },
  {
    id: "coco-club-house",
    src: "/project-details/coco club house.webp",
    alt: "Coco County clubhouse and amenity view",
    projectName: "Coco County",
    projectSlug: "coco-county",
    category: "Amenities"
  },
  {
    id: "cherry-garden",
    src: "/project-details/cherry garden.jpeg",
    alt: "Cherry County landscaped garden",
    projectName: "Cherry County",
    projectSlug: "cherry-county",
    category: "Landscape"
  },
  {
    id: "center-court",
    src: "/project-details/centercourt.png",
    alt: "Center Court Gurugram residential development",
    projectName: "Center Court",
    projectSlug: "center-court",
    category: "Exterior"
  },
  {
    id: "olive-building",
    src: "/project-details/olive building.jpg",
    alt: "Olive County Ghaziabad residential towers",
    projectName: "Olive County",
    projectSlug: "olive-county",
    category: "Exterior"
  },
  {
    id: "county-courtyard-commercial",
    src: "/project-details/courtyard.png",
    alt: "County Courtyard commercial development",
    projectName: "County Courtyard",
    projectSlug: "county-courtyard",
    category: "Exterior"
  },
  {
    id: "jade-building",
    src: "/project-details/jade building.webp",
    alt: "Jade County residential tower exterior",
    projectName: "Jade County",
    projectSlug: "jade-county",
    category: "Exterior"
  },
  {
    id: "clove-outdoor-sitting",
    src: "/project-details/clove outside sitting.jpg",
    alt: "Clove County outdoor lifestyle seating",
    projectName: "Clove County",
    projectSlug: "clove-county",
    category: "Lifestyle"
  }
];

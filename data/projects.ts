export type Project = {
  slug: string;
  name: string;
  developer: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  startingPrice: string;
  startingPriceValue?: number;
  maxPriceValue?: number;
  configurations: string[];
  status: string;
  possession: string;
  heroImage: string;
  logo: string;
  cardImages: string[];
  gallery: string[];
  highlights: {
    title: string;
    description: string;
    icon?: string;
  }[];
  amenities: string[];
  statistics: {
    value: string;
    label: string;
  }[];
  connectivity: {
    destination: string;
    distance: string;
  }[];
  floorPlans?: {
    title: string;
    image: string;
    size: string;
  }[];
  brochureUrl?: string;
};

const priceOnRequest = "Price on request";
const agLogo = "/ag-logo.png";

export const projects: Project[] = [
  {
    slug: "clove-county",
    name: "Clove County",
    developer: "County Group",
    tagline: "Ultra-luxury 4 and 5 BHK residences planned around privacy, biophilic design and low-density living.",
    shortDescription: "A three-tower ultra-luxury address in Sector 151, Noida with approximately 226 large-format residences.",
    fullDescription:
      "Clove County is planned at Plot GH-02, Sector 151, Noida as an ultra-luxury residential development by Shirja Real Estate Solutions Pvt. Ltd. The project is registered under RERA number UPRERAPRJ696539/11/2025, with RERA registration dated 27 November 2025 and declared completion on 13 October 2030. County Group positions it as a Noida Expressway-side luxury development with biophilic planning, large residences, landscaped open spaces, premium materials and an upscale clubhouse ecosystem.",
    location: "Plot GH-02, Sector 151, Noida",
    startingPrice: priceOnRequest,
    configurations: ["4 BHK", "5 BHK"],
    status: "New Launch",
    possession: "RERA completion: 13 October 2030",
    heroImage: "/project-details/clove building.webp",
    logo: "/logos/clove.png",
    cardImages: ["/project-details/clove outside sitting.jpg", "/project-details/clove building.webp", "/project-details/clove garden.webp"],
    gallery: ["/project-details/clove ariel building.jpg", "/project-details/clove building.webp", "/project-details/clove outside sitting.jpg", "/project-details/clove garden.webp"],
    highlights: [
      { title: "Low-density Luxury", description: "Approximately 226 residences across three towers create a more private luxury environment." },
      { title: "RERA Registered", description: "Registered as UPRERAPRJ696539/11/2025 with declared completion on 13 October 2030." },
      { title: "Biophilic Planning", description: "The design narrative focuses on landscaped open spaces, light, ventilation and nature-led living." },
      { title: "Premium Specification", description: "County lists imported marble, laminated wooden flooring, UPVC windows and branded sanitary fittings." }
    ],
    amenities: ["Clubhouse", "Swimming pool", "Sports courts", "Zen garden", "Amphitheatre", "Retail component", "Business centre", "Grand ballroom", "Guest suites", "Integrated security"],
    statistics: [
      { value: "3", label: "Towers" },
      { value: "226", label: "Approx. residences" },
      { value: "4/5 BHK", label: "Configurations" },
      { value: "2030", label: "RERA completion" }
    ],
    connectivity: [
      { destination: "Sector 148 Metro", distance: "Noida Expressway corridor access" },
      { destination: "Yamuna Expressway", distance: "Regional connectivity" },
      { destination: "Delhi", distance: "NCR road network" },
      { destination: "IGI Airport", distance: "Traffic-dependent drive time" }
    ],
    floorPlans: [{ title: "Location plan", image: "/project-details/clove map.jpeg", size: "4 and 5 BHK large-format residences" }]
  },
  {
    slug: "ivory-county",
    name: "Ivory County",
    developer: "County Group",
    tagline: "A 28-acre premium and ultra-luxury address with Ivory County and Ivory Gold residences.",
    shortDescription: "Premium 3 and 4 BHK homes plus larger Ivory Gold 4 and 5 BHK residences in Sector 115, Noida.",
    fullDescription:
      "Ivory County is located at Plot GH-01, Sector 115, Noida and is promoted by ThemeCounty Pvt. Ltd. County Group describes the project as approximately 28 acres with around 11 acres of landscaping, a 4-acre lagoon and 2,372 living units. The development includes premium 3 and 4 BHK homes under Ivory County and larger ultra-luxury 4 and 5 BHK residences under Ivory Gold. RERA references include promoter registration UPRERAPRM206951 and project phases UPRERAPRJ256314, UPRERAPRJ115902 and UPRERAPRJ507062.",
    location: "Plot GH-01, Sector 115, Noida",
    startingPrice: "From INR 3.6 Cr*",
    startingPriceValue: 36_000_000,
    configurations: ["3 BHK", "4 BHK", "5 BHK"],
    status: "Under Development",
    possession: "As per phase-wise RERA",
    heroImage: "/project-details/IVORY BANNER.webp",
    logo: "/logos/ivory.png",
    cardImages: ["/project-details/ivory building.webp", "/project-details/ivory garden.webp", "/project-details/ivory gaarden.png"],
    gallery: ["/project-details/IVORY BANNER.webp", "/project-details/ivory building.webp", "/project-details/ivory garden.webp", "/project-details/ivory gaarden.png"],
    highlights: [
      { title: "28-acre Address", description: "County material describes approximately 28 acres with extensive landscaping and a lagoon." },
      { title: "Ivory Gold", description: "The ultra-luxury collection includes larger 4 and 5 BHK residences." },
      { title: "Rich Landscape", description: "The master plan includes programmed gardens, courts, plazas, wet-play areas and community zones." },
      { title: "Phase RERA", description: "County lists separate RERA references for multiple project phases." }
    ],
    amenities: ["Club Ivor", "Club Aurus", "Swimming pool", "Indoor swimming pool", "Gym", "Restaurant", "Spa", "Yoga room", "Salon", "Billiards", "Card room", "Guest rooms", "Performance plaza", "Amphitheatre", "Multipurpose courts"],
    statistics: [
      { value: "28 acres", label: "Approx. land" },
      { value: "2,372", label: "Living units" },
      { value: "11 acres", label: "Landscaping" },
      { value: "4 acres", label: "Lagoon" }
    ],
    connectivity: [
      { destination: "Sector 115", distance: "Noida" },
      { destination: "Noida city sectors", distance: "Internal road network" },
      { destination: "Delhi-NCR", distance: "Regional access" }
    ],
    floorPlans: [
      { title: "Ivory Plan A", image: "/project-details/ivory map.webp", size: "3 BHK - 2,034 sq. ft. super area" },
      { title: "Ivory Plan B", image: "/project-details/ivory map.webp", size: "3 BHK - 2,304 sq. ft. super area" },
      { title: "Ivory Plan C", image: "/project-details/ivory map.webp", size: "4 BHK - 2,727 sq. ft. super area" },
      { title: "Ivory Gold 5 BHK", image: "/project-details/ivory map.webp", size: "5 BHK - 6,939 sq. ft. super area" }
    ]
  },
  {
    slug: "county-107",
    name: "County 107",
    developer: "County Group",
    tagline: "A very low-density ultra-luxury high-rise address with large 4/5 BHK and duplex residences.",
    shortDescription: "A signature Sector 107, Noida estate with 224 standard homes and 6 duplexes across four towers.",
    fullDescription:
      "County 107 is an ultra-luxury residential development in Sector 107, Noida. County Group describes the project as four towers with 31 floors, 224 standard residences and six duplexes. It is registered under RERA number UPRERAPRJ837374, with promoter registration UPRERAPRM76286. The project is known for an elevated walkway, a vehicle-free ground concept, vertical greens and the Falling Waters club experience.",
    location: "Sector 107, Noida",
    startingPrice: priceOnRequest,
    configurations: ["4 BHK", "5 BHK", "Duplex"],
    status: "Possession Started",
    possession: "Possession started",
    heroImage: "/project-details/107 building.jpg",
    logo: "/logos/county-107.png",
    cardImages: ["/project-details/107 balcony view.jpg", "/project-details/107 building.jpg", "/project-details/countycourtyard.webp"],
    gallery: ["/project-details/107 balcony view.jpg", "/project-details/107 building.jpg", "/project-details/countycourtyard.webp", "/project-details/107 map.webp"],
    highlights: [
      { title: "Extreme Low Density", description: "224 standard homes and 6 duplexes across four towers." },
      { title: "Elevated Walkway", description: "A raised pedestrian and lifestyle loop connects towers and leisure spaces." },
      { title: "Vehicle-free Ground", description: "County states that ground-level vehicular circulation is eliminated or greatly restricted." },
      { title: "Vertical Greens", description: "Planting integrated into balconies forms part of the architectural concept." }
    ],
    amenities: ["Falling Waters club", "Elevated walkway", "Outdoor sports", "Teen area", "Tot lot", "Worship space", "Club drop-off", "Basement entry", "Security systems"],
    statistics: [
      { value: "4", label: "Towers" },
      { value: "31", label: "Floors" },
      { value: "224", label: "Standard homes" },
      { value: "6", label: "Duplexes" }
    ],
    connectivity: [
      { destination: "Sector 107", distance: "Noida" },
      { destination: "Club Falling Waters", distance: "Within development" },
      { destination: "Noida city network", distance: "Established sector access" }
    ],
    floorPlans: [
      { title: "Type A", image: "/project-details/107 map.webp", size: "5 bedrooms, family lounge, 6 toilets, 6 balconies and servant areas" },
      { title: "Type B", image: "/project-details/107 map.webp", size: "4 bedrooms, family lounge, 5 toilets, 4 balconies and servant areas" },
      { title: "Type C", image: "/project-details/107 map.webp", size: "4 bedrooms, family lounge, 5 toilets, 4 balconies and servant room" }
    ]
  },
  {
    slug: "ivy-county",
    name: "Ivy County",
    developer: "County Group",
    tagline: "An eco-conscious Sector 75 address shaped around landscaping, natural light and family layouts.",
    shortDescription: "A 5.1-acre Sector 75, Noida community with 546 residences across five towers.",
    fullDescription:
      "Ivy County is located in Sector 75, Noida and is described by County Group as a 5.1-acre development with five towers, 27 floors and 546 residences. The project offers 3 and 4 BHK homes and uses an eco-conscious design narrative inspired by the evergreen ivy plant, with emphasis on landscaping, open spaces, natural lighting, ventilation and light-scaping.",
    location: "Sector 75, Noida",
    startingPrice: priceOnRequest,
    configurations: ["3 BHK", "4 BHK"],
    status: "Advanced Stage",
    possession: "Possession soon / advanced stage",
    heroImage: "/project-details/ivy building.webp",
    logo: "/logos/ivy.png",
    cardImages: ["/project-details/ivy building.webp", "/project-details/ivy inside.webp", "/projects/ivy.webp"],
    gallery: ["/project-details/ivy building.webp", "/project-details/ivy inside.webp", "/projects/ivy.webp"],
    highlights: [
      { title: "Sector 75 Address", description: "An established Noida location suited to family buyers." },
      { title: "5.1-acre Planning", description: "County describes five towers and 546 residences across approximately 5.1 acres." },
      { title: "Eco-conscious Concept", description: "The project is positioned around landscaping, open spaces, natural lighting and ventilation." },
      { title: "Family Layouts", description: "The planning focuses on usable room proportions and functional 3 and 4 BHK homes." }
    ],
    amenities: ["Swimming pool", "Fitness centre", "Coffee lounge", "Lawn tennis", "Billiards", "Basketball court", "Banquet hall", "Restaurant"],
    statistics: [
      { value: "5.1 acres", label: "Approx. land" },
      { value: "5", label: "Towers" },
      { value: "27", label: "Floors" },
      { value: "546", label: "Residences" }
    ],
    connectivity: [
      { destination: "Sector 75", distance: "Noida" },
      { destination: "Established Noida sectors", distance: "Neighbourhood connectivity" },
      { destination: "Family conveniences", distance: "Nearby urban ecosystem" }
    ]
  },
  {
    slug: "coco-county",
    name: "Coco County",
    developer: "County Group",
    tagline: "A completed Greater Noida West community with tropical landscaping and efficient 3 BHK homes.",
    shortDescription: "A Sector 10, Greater Noida West project with approximately 838 homes across three towers.",
    fullDescription:
      "Coco County is located in Sector 10, Greater Noida West. County Group describes it as an approximately 4.5-acre development with three towers, 23 floors and around 838 homes, principally 3 BHK. The project is registered under RERA number UPRERAPRJ958386, with promoter Shirja Real Estate Solutions Pvt. Ltd. and promoter RERA UPRERAPRM80484. County's portfolio identifies the project as started around 2019 and completed around 2023.",
    location: "Sector 10, Greater Noida West",
    startingPrice: priceOnRequest,
    configurations: ["3 BHK"],
    status: "Completed",
    possession: "Completed around 2023",
    heroImage: "/project-details/coco building.avif",
    logo: agLogo,
    cardImages: ["/project-details/coco building.avif", "/project-details/coco club house.webp", "/project-details/mapcoco.jpg"],
    gallery: ["/project-details/coco building.avif", "/project-details/coco club house.webp", "/project-details/coco locationmap.jpg", "/project-details/mapcoco.jpg"],
    highlights: [
      { title: "Completed Community", description: "County chronology places completion around 2023." },
      { title: "Tropical Landscape", description: "The project uses a tropical landscape theme with green buffers." },
      { title: "Corner Plot", description: "County material highlights a corner plot with green buffers on two sides." },
      { title: "Efficient 3 BHK", description: "Older material identifies representative 3 BHK + 2 toilet plans around 1,152 sq. ft." }
    ],
    amenities: ["Landscaped parks", "Children's play areas", "Swimming pool", "Spa", "Steam", "Jacuzzi", "Gym", "Lawn tennis", "Badminton", "Table tennis", "Card room", "Billiards", "Yoga/aerobics", "Restaurant", "Rainwater harvesting"],
    statistics: [
      { value: "4.5 acres", label: "Approx. land" },
      { value: "3", label: "Towers" },
      { value: "23", label: "Floors" },
      { value: "838", label: "Approx. homes" }
    ],
    connectivity: [
      { destination: "Sector 10", distance: "Greater Noida West" },
      { destination: "80-metre road", distance: "Project frontage context" },
      { destination: "Greater Noida West", distance: "Established residential belt" }
    ],
    floorPlans: [{ title: "Representative 3 BHK", image: "/project-details/coco locationmap.jpg", size: "Approx. 1,152 sq. ft. super area in older campaign material" }]
  },
  {
    slug: "cherry-county",
    name: "Cherry County",
    developer: "County Group",
    tagline: "A completed Greater Noida West community planned around generous open space and family living.",
    shortDescription: "A completed 12-acre Greater Noida West residential community with approximately 75% open space.",
    fullDescription:
      "Cherry County is a completed legacy residential community in Greater Noida West. County records the project as launched around 2010 and completed around 2016. The project is described as a corner-plot, green-belt-facing high-rise community with extensive landscaping, podium or plaza-led planning and family-oriented residential infrastructure.",
    location: "Greater Noida West",
    startingPrice: priceOnRequest,
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    status: "Completed",
    possession: "Completed around 2016",
    heroImage: "/project-details/cherry building.webp",
    logo: "/logos/cherry-county.png",
    cardImages: ["/project-details/cherry building.webp", "/project-details/cherry garden.jpeg", "/project-details/cherry aminities.jpg"],
    gallery: ["/project-details/cherry building.webp", "/project-details/cherry garden.jpeg", "/project-details/cherry aminities.jpg", "/project-details/cherry map.jpeg"],
    highlights: [
      { title: "Legacy Community", description: "County chronology records launch around 2010 and completion around 2016." },
      { title: "75% Open Space", description: "County material describes approximately 75% open area." },
      { title: "Green-belt Facing", description: "The project is positioned as a corner-plot development facing green belts." },
      { title: "Landscape Consultant", description: "County credits international-standard landscaping by Zoras, London." }
    ],
    amenities: ["Clubhouse", "Swimming pool", "Sports courts", "Children's areas", "Landscaped parks", "High-speed OTIS elevators", "24-hour services", "Security infrastructure"],
    statistics: [
      { value: "12 acres", label: "Approx. land" },
      { value: "25%", label: "Construction footprint" },
      { value: "75%", label: "Open space" },
      { value: "2016", label: "Completion chronology" }
    ],
    connectivity: [
      { destination: "Greater Noida West", distance: "Established residential corridor" },
      { destination: "Green belt", distance: "Project-facing context" }
    ],
    floorPlans: [{ title: "Location map", image: "/project-details/cherry map.jpeg", size: "Completed legacy community" }]
  },
  {
    slug: "cleo-county",
    name: "Cleo County",
    developer: "County Group",
    tagline: "An established Sector 121 community known for Egyptian-inspired architecture and themed landscaping.",
    shortDescription: "A completed premium Noida community with an Egyptian-inspired residential and landscape theme.",
    fullDescription:
      "Cleo County is a completed legacy project in Sector 121, Noida. County Group records launch chronology around 2014 and completion around 2021. The development is known for Egyptian-inspired architectural imagery, monumental arrival, regal landscape elements, clubhouse infrastructure and established community living. Current buyer value is tied to resale inventory, actual occupancy, maintenance quality and live transaction data.",
    location: "Sector 121, Noida",
    startingPrice: priceOnRequest,
    configurations: ["3 BHK", "4 BHK"],
    status: "Completed",
    possession: "Completed around 2021",
    heroImage: "/project-details/cleo.webp",
    logo: "/logos/cleo county.png",
    cardImages: ["/project-details/cleo building.jpg", "/project-details/cleo garden.jpeg", "/project-details/cleo interior.jpg"],
    gallery: ["/project-details/cleo.webp", "/project-details/cleo building.jpg", "/project-details/cleo garden.jpeg", "/project-details/cleo interior.jpg"],
    highlights: [
      { title: "Themed Community", description: "Cleo County draws from Egyptian architectural and landscape concepts." },
      { title: "Established Occupancy", description: "The project is a completed community rather than a new-launch development." },
      { title: "Premium Noida Living", description: "It is positioned as an established premium community in Sector 121, Noida." },
      { title: "Resale-led Context", description: "Current pricing and inventory should be checked against live resale data." }
    ],
    amenities: ["Clubhouse", "Landscaped areas", "Lifestyle amenities", "Recreational infrastructure", "Open views", "Family-oriented community spaces"],
    statistics: [
      { value: "Sector 121", label: "Location" },
      { value: "2014", label: "Launch chronology" },
      { value: "2021", label: "Completion chronology" },
      { value: "Completed", label: "Status" }
    ],
    connectivity: [
      { destination: "Sector 121", distance: "Noida" },
      { destination: "Established community", distance: "Occupancy-led ecosystem" }
    ],
    floorPlans: [{ title: "Location map", image: "/project-details/cleo map.jpg", size: "Completed premium Noida community" }]
  },
  {
    slug: "jade-county",
    name: "Jade County",
    developer: "County Group",
    tagline: "A Wave City, Ghaziabad premium high-rise inspired by jade stone, wellness and green planning.",
    shortDescription: "An approximately 13-acre Wave City address with 3, 4 and 5 BHK residences and Club Aqua.",
    fullDescription:
      "Jade County is located in Wave City, Ghaziabad. County Group describes it as an approximately 13-acre premium/luxury high-rise development with nine towers, around 1,014 residences and 3, 4 and 5 BHK configurations. It is marketed as an IGBC Gold-rated development inspired by jade stone, with a wellness/luxury narrative built around balance, calm, nature, indoor-outdoor integration, green planning and energy efficiency. Jade County Gold is also marketed as an ultra-luxury extension focused on larger 5 BHK residences.",
    location: "Wave City, Ghaziabad",
    startingPrice: priceOnRequest,
    configurations: ["3 BHK", "4 BHK", "5 BHK"],
    status: "Under Development",
    possession: "Under development",
    heroImage: "/project-details/jade building.webp",
    logo: "/logos/jade.png",
    cardImages: ["/project-details/jade garden.jpg", "/project-details/jade building.webp", "/project-details/jade sitting.jpg"],
    gallery: ["/project-details/jade ariel garden.jpg", "/project-details/jade building.webp", "/project-details/jade garden.jpg", "/project-details/jade sitting.jpg"],
    highlights: [
      { title: "IGBC Gold-rated", description: "Jade County is marketed as an IGBC Gold-rated development." },
      { title: "Seven-level Pool", description: "A seven-level cascading pool is one of the headline amenities." },
      { title: "Club Aqua", description: "The central wellness and leisure offering is branded Club Aqua." },
      { title: "Jade County Gold", description: "The ultra-luxury extension focuses on larger 5 BHK residences." }
    ],
    amenities: ["Club Aqua", "Seven-level cascading pool", "Green planning", "Wellness spaces", "Indoor-outdoor amenities", "Landscaped gardens", "Energy-efficient design"],
    statistics: [
      { value: "13 acres", label: "Approx. land" },
      { value: "9", label: "Towers" },
      { value: "1,014", label: "Approx. residences" },
      { value: "IGBC Gold", label: "Sustainability" }
    ],
    connectivity: [
      { destination: "Delhi-Meerut Expressway", distance: "Regional connectivity" },
      { destination: "Wave City", distance: "Ghaziabad" },
      { destination: "Delhi-NCR", distance: "Road network access" }
    ],
    floorPlans: [{ title: "Location plan", image: "/project-details/jade map.webp", size: "3, 4 and 5 BHK residences" }]
  },
  {
    slug: "center-court",
    name: "Center Court",
    developer: "County Group",
    tagline: "A completed Sector 88A, Gurugram address planned around a broad central lifestyle zone.",
    shortDescription: "A ready-move 3 BHK Gurugram development near Pataudi Road and the Dwarka Expressway corridor.",
    fullDescription:
      "The Center Court is located in Sector 88A, Pataudi Road, Harsaru, Gurugram. County Group positions it as a completed or ready-move 3 BHK development. Project material references HARERA registration RC/REP/HARERA/GGM/46 of 2017/7(3)/45/2024/04 and promoter Ashiana Landcraft Realty Pvt. Ltd. The apartment sizes referenced by County range approximately from 1,565 sq. ft. to 2,175 sq. ft. super area, depending on layout.",
    location: "Sector 88A, Pataudi Road, Gurugram",
    startingPrice: priceOnRequest,
    configurations: ["3 BHK"],
    status: "Completed / Ready Move",
    possession: "Completed / ready-move positioning",
    heroImage: "/project-details/centercourt.png",
    logo: "/logos/the-center-court.png",
    cardImages: ["/project-details/centercourt.png", "/project-details/centercourt.png", "/project-details/centercourt.png"],
    gallery: ["/project-details/centercourt.png"],
    highlights: [
      { title: "Central Open Zone", description: "The towers are aligned to preserve a broad central lifestyle area." },
      { title: "Club Mocha", description: "The clubhouse and lifestyle hub is branded Club Mocha." },
      { title: "3 BHK Focus", description: "County references 3 BHK homes ranging approximately from 1,565 to 2,175 sq. ft. super area." },
      { title: "Safety Systems", description: "Official material mentions earthquake resistance, fire-resistant materials, smoke detectors and sprinklers." }
    ],
    amenities: ["Club Mocha", "Resort-style outdoor pool", "Heated indoor pool", "Gym", "Yoga spaces", "Children's play areas", "Landscaped gardens", "Amphitheatre", "Tennis", "Cricket practice nets"],
    statistics: [
      { value: "3 BHK", label: "Configuration" },
      { value: "1,565-2,175", label: "Sq. ft. super area" },
      { value: "88A", label: "Sector" },
      { value: "Ready", label: "Positioning" }
    ],
    connectivity: [
      { destination: "Pataudi Road", distance: "Local access" },
      { destination: "Dwarka Expressway corridor", distance: "Regional growth corridor" },
      { destination: "NH-48", distance: "Connectivity toward Gurugram and Delhi" },
      { destination: "Manesar", distance: "Employment-zone access" }
    ],
    floorPlans: [{ title: "3 BHK Homes", image: "/project-details/centercourt.png", size: "Approx. 1,565 to 2,175 sq. ft. super area" }]
  },
  {
    slug: "olive-county",
    name: "Olive County",
    developer: "County Group",
    tagline: "A completed Vasundhara community planned around open greens, Vaastu-oriented homes and legacy living.",
    shortDescription: "An established Sector 5, Vasundhara address with 2 and 3 BHK homes across 16 high-rise towers.",
    fullDescription:
      "Olive County is located in Sector 5, Vasundhara, Ghaziabad. County Group describes it as an approximately 13-acre completed legacy development with 16 high-rise towers, 2 and 3 BHK configurations, approximately 80% open area and around 5 acres of landscaped greens. County's chronology records the project as started around 2008 and completed around 2012.",
    location: "Sector 5, Vasundhara, Ghaziabad",
    startingPrice: priceOnRequest,
    configurations: ["2 BHK", "3 BHK"],
    status: "Completed",
    possession: "Completed around 2012",
    heroImage: agLogo,
    logo: "/logos/olive-county.png",
    cardImages: [agLogo, agLogo, agLogo],
    gallery: [agLogo],
    highlights: [
      { title: "Established Legacy", description: "County chronology records completion around 2012." },
      { title: "80% Open Area", description: "Official material references approximately 80% open area." },
      { title: "5-acre Greens", description: "The project includes approximately 5 acres of landscaped greens." },
      { title: "Nature-led Context", description: "The location sits near the Hindon Canal and green-belt environment." }
    ],
    amenities: ["Flower garden", "Acupressure walking path", "Power backup", "High-speed elevators", "International landscaping", "Open greens", "Earthquake-resistant RCC frame"],
    statistics: [
      { value: "13 acres", label: "Approx. land" },
      { value: "16", label: "Towers" },
      { value: "80%", label: "Open area" },
      { value: "5 acres", label: "Landscaped greens" }
    ],
    connectivity: [
      { destination: "Sector 5", distance: "Vasundhara" },
      { destination: "Hindon Canal", distance: "Green-belt context" },
      { destination: "Ghaziabad", distance: "Established city network" }
    ],
    floorPlans: [{ title: "Location map", image: "/project-details/olive map.jpg", size: "2 and 3 BHK completed legacy community" }]
  },
  {
    slug: "orange-county",
    name: "Orange County",
    developer: "County Group",
    tagline: "One of County Group's earliest completed communities in Indirapuram, Ghaziabad.",
    shortDescription: "A completed GH-4, Indirapuram community with 2, 3 and 4 BHK homes plus selected penthouses.",
    fullDescription:
      "Orange County is located at GH-4, Indirapuram, Ghaziabad. County Group describes it as an approximately 5-acre completed legacy community with around 14 high-rise towers, 2, 3 and 4 BHK homes plus selected penthouses and approximately 80% open area. County records the project as started around 2005 and completed around 2011, making it part of the brand's early Ghaziabad legacy.",
    location: "GH-4, Indirapuram, Ghaziabad",
    startingPrice: priceOnRequest,
    configurations: ["2 BHK", "3 BHK", "4 BHK", "Penthouse"],
    status: "Completed",
    possession: "Completed around 2011",
    heroImage: "/project-details/olive building.jpg",
    logo: "/logos/orange-county.png",
    cardImages: ["/project-details/olive building.jpg", "/project-details/olive garden.jpg", "/project-details/olive map.jpg"],
    gallery: ["/project-details/olive building.jpg", "/project-details/olive garden.jpg", "/project-details/olive map.jpg"],
    highlights: [
      { title: "Early County Legacy", description: "Orange County is one of the developer's oldest completed communities." },
      { title: "80% Open Area", description: "County material describes approximately 80% open area." },
      { title: "Broad Configuration Mix", description: "The community includes 2, 3 and 4 BHK homes plus selected penthouses." },
      { title: "Established Indirapuram", description: "Current buyer context is resale-led and should be checked against live inventory." }
    ],
    amenities: ["Clubhouse", "Swimming pool", "Gymnasium", "Sports facilities", "Steam", "Sauna", "Yoga/wellness areas", "High-speed elevators", "Centralized gas", "Round-the-clock services"],
    statistics: [
      { value: "5 acres", label: "Approx. land" },
      { value: "14", label: "Approx. towers" },
      { value: "80%", label: "Open area" },
      { value: "2011", label: "Completion chronology" }
    ],
    connectivity: [
      { destination: "GH-4", distance: "Indirapuram" },
      { destination: "Ghaziabad", distance: "Established residential market" }
    ]
  },
  {
    slug: "county-courtyard",
    name: "County Courtyard",
    developer: "County Group",
    tagline: "A Delhi commercial and mixed-use development combining office, retail, dining and leisure.",
    shortDescription: "A 1.1 million sq. ft. commercial development at Netaji Subhash Place, Pitampura, Delhi.",
    fullDescription:
      "County Courtyard is a commercial and mixed-use development located at G-2/G-4, Netaji Subhash Place, Pitampura, Delhi. County Group describes it as two towers with six retail floors, 38 office floors and approximately 1.1 million sq. ft. of development. RERA references include DLRERA2022P0008 for Wing A and DLRERA2022P0009 for Wing B. The development combines office space, retail, dining, entertainment and leisure.",
    location: "Netaji Subhash Place, Pitampura, Delhi",
    startingPrice: priceOnRequest,
    configurations: ["Office", "Retail", "Food Court", "Multiplex"],
    status: "Commercial",
    possession: "Under development/current",
    heroImage: "/project-details/courtyard.png",
    logo: "/logos/county-courtyard.png",
    cardImages: ["/project-details/courtyard.png", "/project-details/countycourtyard-commercial.webp", "/project-details/courtyard.png"],
    gallery: ["/project-details/courtyard.png", "/project-details/countycourtyard-commercial.webp"],
    highlights: [
      { title: "Mixed-use Commercial", description: "Combines office, retail, food, dining, entertainment and leisure uses." },
      { title: "Delhi RERA", description: "County lists Wing A as DLRERA2022P0008 and Wing B as DLRERA2022P0009." },
      { title: "Office Specification", description: "Separate office drop-off, 9 ft corridors, 13.3 ft floor-to-floor height and VRV AC provision." },
      { title: "Retail Frontage", description: "County cites approximately 110,347 sq. ft. of retail area across visible lower levels." }
    ],
    amenities: ["Office space", "Retail", "Food court", "Four-screen multiplex", "EV charging", "Smart lighting", "Three-level basement parking", "Breakout terraces", "24x7 power backup"],
    statistics: [
      { value: "1.1M sq.ft.", label: "Approx. development" },
      { value: "2", label: "Towers" },
      { value: "6", label: "Retail floors" },
      { value: "38", label: "Office floors" }
    ],
    connectivity: [
      { destination: "Netaji Subhash Place", distance: "Delhi commercial district" },
      { destination: "Pitampura", distance: "North Delhi" },
      { destination: "Retail frontage", distance: "Approx. 91 m Wing A / 93 m Wing B cited by County" }
    ]
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string) {
  return projects.filter((project) => project.slug !== slug).slice(0, 3);
}

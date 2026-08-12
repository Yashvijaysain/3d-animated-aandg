export type TeamMember = {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  image: string;
  description?: string;
  linkedin?: string;
  featured?: boolean;
};

export const teamMembers: TeamMember[] = [
  {
    id: "advisor-01",
    name: "A&G Team Member 01",
    role: "Director",
    shortRole: "Director",
    image: "/images/team/member-01.webp",
    featured: true,
  },
  {
    id: "research-01",
    name: "A&G Team Member 02",
    role: "General Manager",
    shortRole: "Management",
    image: "/images/team/member-02.webp",
  },
  {
    id: "client-01",
    name: "A&G Team Member 03",
    role: "Admin",
    shortRole: "Admin",
    image: "/images/team/member-03.webp",
  },
  {
    id: "advisor-02",
    name: "A&G Team Member 04",
    role: "Sales Head",
    shortRole: "Sales",
    image: "/images/team/member-04.webp",
  },
  {
    id: "research-02",
    name: "A&G Team Member 05",
    role: "Sales Executive",
    shortRole: "Sales",
    image: "/images/team/member-05.webp",
  },
  {
    id: "client-02",
    name: "A&G Team Member 06",
    role: "Graphic Designer",
    shortRole: "Design",
    image: "/images/team/member-06.webp",
  },
];

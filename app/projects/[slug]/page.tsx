import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/project-detail/ProjectDetailPage";
import { getProject, getRelatedProjects, projects } from "@/data/projects";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found"
    };
  }

  const title = `${project.name}, ${project.location}`;
  const openGraphTitle = `${title} | A&G Realtors`;
  const description = project.shortDescription;
  const url = `/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url,
      images: [
        {
          url: project.heroImage,
          alt: project.name
        }
      ]
    }
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPage project={project} relatedProjects={getRelatedProjects(project.slug)} />;
}

import { ChevronRight, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface Page {
  name: string;
  href: string;
  current: boolean;
}

interface BreadcrumbsProps {
  pages: Page[];
}

export default function Breadcrumbs({ pages }: BreadcrumbsProps) {
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  useEffect(() => {
    setCurrentProjectId(localStorage.getItem("projectId") || "");
  }, []);
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a
              href={`/home/${currentProjectId}`}
              className="text-primary hover:text-muted-foreground"
            >
              <Home className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRight
                className="h-5 w-5 flex-shrink-0 text-primary"
                aria-hidden="true"
              />
              <a
                href={page.href}
                className="ml-4 text-sm font-medium text-primary hover:text-muted-foreground"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface FooterProps {
  breadcrumbs?: BreadcrumbItem[];
}

export const Footer: React.FC<FooterProps> = ({ breadcrumbs: propBreadcrumbs }) => {
  const location = useLocation();

  // If no breadcrumbs prop is passed, auto-generate breadcrumbs from the URL path.
  const breadcrumbs =
    propBreadcrumbs ??
    (() => {
      const pathname = location.pathname;
      const pathSegments = pathname.split("/").filter(Boolean);
      return [
        { label: "Home", href: "/" },
        ...pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          // Optionally format the label (capitalize first letter)
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);
          return { label, href };
        }),
      ];
    })();

  return (
    <footer className="border-t mt-8 text-center text-muted-foreground">
      <div className="mx-auto">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={index} className="inline-flex items-center">
                    {!isLast && item.href ? (
                      <Link
                        to={item.href}
                        className="text-sm font-medium text-gray-700 hover:text-blue-600"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-gray-500">
                        {item.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <svg
                        className="w-4 h-4 text-gray-400 mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <p>© {new Date().getFullYear()} ClaimRequest. All rights reserved.</p>
      </div>
    </footer>
  );
};

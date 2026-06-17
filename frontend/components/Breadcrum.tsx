"use client";

import Link from "next/link";

export interface BreadcrumProps {
  crumbs: { label: string; href?: string }[];
}

export default function Breadcrum({ crumbs }: BreadcrumProps) {
  return (
    <nav className="bc-trail" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.label} className="bc-trail-item">
            {i > 0 && <span className="bc-sep" aria-hidden="true">›</span>}
            {isLast ? (
              <span className="bc-current">{crumb.label}</span>
            ) : (
              <Link href={crumb.href ?? "#"} className="bc-link">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}

      <style jsx>{`
        .bc-trail {
          display: flex;
          align-items: center;
          gap: 0;
          font-size: 13px;
          font-family: 'matterregular', sans-serif;
        }

        .bc-trail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #C9C5C5;
        }

        .bc-link {
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          transition: color 0.2s;
        }
        .bc-link:hover { color: #fff; }

        .bc-sep {
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          margin: 0 6px;
        }

        .bc-current {
          color: #fff;
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
}
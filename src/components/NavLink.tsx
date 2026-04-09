'use client';

import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

interface NavLinkProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  to?: LinkProps["href"];
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, to, href, ...props }, ref) => {
    const pathname = usePathname();
    const resolvedHref = to ?? href;
    const hrefString =
      typeof resolvedHref === "string"
        ? resolvedHref
        : resolvedHref instanceof URL
          ? resolvedHref.pathname + resolvedHref.search + resolvedHref.hash
          : "";

    const isActive = hrefString && pathname === hrefString;

    return (
      <Link
        ref={ref}
        href={resolvedHref ?? "#"}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };


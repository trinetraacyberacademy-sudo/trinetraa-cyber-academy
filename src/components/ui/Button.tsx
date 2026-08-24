import { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  icon?: ReactNode;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const variants = {
    primary:
      "bg-signal-600 text-white shadow-md shadow-signal-600/20 hover:bg-signal-700 hover:shadow-lg hover:shadow-signal-600/25",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:border-signal-400 hover:bg-slate-50",
    ghost: "text-slate-600 hover:text-signal-700",
  };

  const sizes = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const isExternal = href.startsWith("http") || href.startsWith("tel:");

  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={clsx(base, variants[variant], sizes[size], className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {content}
    </Link>
  );
}

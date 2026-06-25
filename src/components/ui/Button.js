const variants = {
  primary: "bg-accent text-primary hover:brightness-95 active:scale-[0.98]",
  secondary: "bg-primary text-white hover:opacity-90 active:scale-[0.98]",
  outline: "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      suppressHydrationWarning
      className={`
        inline-flex items-center justify-center rounded-md font-semibold
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

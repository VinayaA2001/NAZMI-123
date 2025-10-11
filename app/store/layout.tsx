// app/(store)/layout.tsx
"use client"; // Add this if your layout uses client-side features

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="store-layout">
      {children}
    </div>
  );
}
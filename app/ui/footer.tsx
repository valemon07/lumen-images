"use client";

export default function Footer() {
  return (
    <footer className="w-full max-w-2xl text-center py-8 text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Lumen. All rights reserved.</p>
    </footer>
  );
}

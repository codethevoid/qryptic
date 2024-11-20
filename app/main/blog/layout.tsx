import { BlogNav } from "./nav";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="space-y-6 px-4 py-12">
        <BlogNav />
        {children}
      </div>
    </div>
  );
}

import { BlogList } from "@/components/blog";
import { blogIndex } from "@/lib/content/blog";

export default function BlogPage() {
  return <BlogList posts={blogIndex} />;
}

import { HomeBlogPost } from "@/components/blog/home-post";

export default async function Home() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-purple-700 mb-2">
          Welcome Home!
        </h2>
        <p className="text-purple-500 text-lg">
          Here, you can create and read blog posts and keep track of your collection!
        </p>
      </div>
      <HomeBlogPost></HomeBlogPost>
    </div>
  );
}
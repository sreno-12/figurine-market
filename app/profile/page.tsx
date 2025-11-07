import { ProfileBlog } from "@/components/profile/profile-blog";
import { ProfileSideBar } from "@/components/profile/profile-side-bar";

export default async function Profile() {
  return (
    // profile/page.tsx
    <main className="grid lg:grid-cols-3 gap-10 items-start">
      <aside className="self-start"><ProfileSideBar /></aside>
      <section className="lg:col-span-2 self-start"><ProfileBlog /></section>
    </main>

  );
}

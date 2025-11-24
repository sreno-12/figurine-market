import { ProfileBlog } from "@/components/profile/profile-blog";
import { ProfileSideBar } from "@/components/profile/profile-side-bar";

export default async function Profile() {
  return (
    <main className=" max-w-7xl mx-auto py-10 px-6">
      <div className="grid grid-cols-3 gap-10 items-start">
        <aside className="self-start"><ProfileSideBar /></aside>
        <section className="col-span-2 self-start"><ProfileBlog /></section>
      </div>
    </main>

  );
}

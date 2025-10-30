import { ProfileBlog } from "@/components/profile/profile-blog";
import { ProfileSideBar } from "@/components/profile/profile-side-bar";

export default async function Profile() {

  return (
    <main>
      <ProfileBlog></ProfileBlog>
      <ProfileSideBar></ProfileSideBar>
    </main>
  )
}
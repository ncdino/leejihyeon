"use client";
import MainPostList from "./_sections/MainPostList";
import ProfileSection from "./_sections/ProfileSection";
import { useViewStore, useLayoutStore } from "./_store/viewStore";

export default function Home() {
  const { currentView } = useViewStore();
  const headerHeight = useLayoutStore((state) => state.headerHeight);

  return (
    <main className="p-5 max-w-4xl mx-auto" style={{ marginTop: headerHeight }}>
      {currentView === "posts" && <MainPostList />}
      {currentView === "profile" && <ProfileSection />}
    </main>
  );
}

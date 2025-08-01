import { MacbookScroll } from "@/components/MacbookScroll";
import GithubScreen from "@/components/GithubScreen";

export default function Home() {
  return (
    <div>
      <header className="pt-10 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Mason Keresty</h1>
        <p className="text-neutral-500">Software Engineer | DevSecOps | Full-Stack</p>
      </header>

      <MacbookScroll
        title="Explore my GitHub"
        src="" // we won't use this, we override with component below
        showGradient={false}
        badge={
          <div className="text-xs px-2 py-1 rounded bg-blue-500 text-white">Profile Explorer</div>
        }
      >
        <GithubScreen />
      </MacbookScroll>
    </div>
  );
}
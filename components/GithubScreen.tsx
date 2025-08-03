"use client";
import { useEffect, useState } from "react";
import { buildFileTree, FileNode } from "@/utils/fileTree";
import { FileText, Folder, FolderOpen, X, Code, ExternalLink } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { marked } from "marked";

const REPO_NAME = "mkeresty/Portfolio";
const SITE_URL = "https://portfolio-eight-flax-25.vercel.app";

export default function GithubScreen() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO_NAME}/git/trees/main?recursive=1`)
      .then(res => res.json())
      .then(data => {
        const paths = data.tree
          .filter((f: any) => f.type === "blob")
          .map((f: any) => f.path);
        const tree = buildFileTree(paths);
        setFileTree(tree);
      });
  }, []);

  const openFile = async (path: string) => {
    if (!fileContents[path]) {
      const res = await fetch(`https://raw.githubusercontent.com/${REPO_NAME}/main/${path}`);
      const text = await res.text();
      setFileContents((prev) => ({ ...prev, [path]: text }));
    }

    if (!openTabs.includes(path)) {
      setOpenTabs([...openTabs, path]);
    }
    setActiveTab(path);
  };

  const renderFileTree = (nodes: FileNode[]) =>
    nodes.map((node) => (
      <div key={node.path} className="ml-2">
        {node.type === "folder" ? (
          <div>
            <button
              onClick={() =>
                setCollapsed((prev) => ({
                  ...prev,
                  [node.path]: !prev[node.path],
                }))
              }
              className="flex items-center gap-1 text-left text-gray-300 hover:text-white text-[8px]"
            >
              {collapsed[node.path] ? <Folder size={10} /> : <FolderOpen size={10} />}
              {node.name}
            </button>
            {!collapsed[node.path] &&
              node.children &&
              renderFileTree(node.children)}
          </div>
        ) : (
          <button
            onClick={() => openFile(node.path)}
            className="flex items-center gap-1 text-left text-gray-300 hover:text-white px-1 py-0.5 text-[8px]"
          >
            <FileText size={10} />
            {node.name}
          </button>
        )}
      </div>
    ));

  const closeTab = (path: string) => {
    setOpenTabs((tabs) => tabs.filter((t) => t !== path));
    if (activeTab === path) {
      const nextTab = openTabs.find((t) => t !== path);
      setActiveTab(nextTab || null);
    }
  };

  const getFileLanguage = (filename: string) => {
    if (filename.endsWith(".ts")) return "typescript";
    if (filename.endsWith(".tsx")) return "tsx";
    if (filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".py")) return "python";
    if (filename.endsWith(".html")) return "html";
    return "text";
  };

  const backToCode = () => setLaunched(false);

  return (
    <div
      className="w-full h-full rounded-lg flex bg-[#1e1e1e] text-white font-mono text-[8px] overflow-hidden"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setLaunched(true)}
    >
      {!launched ? (
        <>
          {/* Sidebar */}
          <aside className="w-[26%] bg-[#252526] border-r border-[#333] p-1 overflow-y-auto text-[8px]">
            <h2 className="text-[8px] text-gray-400 mb-1">EXPLORER</h2>
            {renderFileTree(fileTree)}
          </aside>

          {/* Editor Area */}
          <main className="w-[74%] flex flex-col h-full">
            {/* Tabs */}
            <div className="bg-[#2d2d2d] px-1 py-0.5 border-b border-[#3f3f46] flex gap-1 overflow-x-auto text-[8px] h-[20px]">
              {openTabs.map((tab) => (
                <div
                  key={tab}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded cursor-pointer text-[8px] leading-none ${
                    tab === activeTab
                      ? "bg-[#1e1e1e] text-white"
                      : "bg-[#3f3f46] text-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tab.split("/").pop()}</span>
                  <X
                    size={10}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-auto bg-[#1e1e1e] p-2 text-[8px] leading-tight min-h-0">
              {activeTab ? (
                activeTab.endsWith(".md") ? (
                  <div
                    className="prose prose-invert max-w-none text-[8px]"
                    dangerouslySetInnerHTML={{
                      __html: marked(fileContents[activeTab] || ""),
                    }}
                  />
                ) : (
                  <SyntaxHighlighter
                    language={getFileLanguage(activeTab)}
                    style={vscDarkPlus}
                    PreTag="div"
                    customStyle={{
                      background: "transparent",
                      fontSize: "8px",
                      padding: 0,
                      margin: 0,
                      minHeight: "100%",
                    }}
                    codeTagProps={{
                      style: {
                        fontSize: "8px",
                        lineHeight: "1.2",
                      },
                    }}
                  >
                    {fileContents[activeTab] || ""}
                  </SyntaxHighlighter>
                )
              ) : (
                <p className="text-gray-500 text-[8px] italic">No file selected</p>
              )}
            </div>

            {/* Terminal */}
            <div className="bg-black text-green-400 px-3 py-2 text-[8px] border-t border-[#333] flex items-center justify-between min-h-[32px]">
              <span
                className="cursor-pointer hover:text-green-300 transition-colors"
                onClick={() => setLaunched(true)}
              >
                $ run site
              </span>
            </div>
          </main>
        </>
      ) : (
        // FULL SIZE IFRAME VIEW
        <div className="w-full h-full flex flex-col">
          {/* Header with controls */}
          <div className="bg-[#2d2d2d] px-3 py-1 border-b border-[#3f3f46] flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-2">
              <button
                onClick={backToCode}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <Code size={10} />
                Back to Code
              </button>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink size={10} />
                Open in New Tab
              </a>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-black flex justify-center items-start">
  <div
    style={{
      width: "1280px",         // Tell iframe it's 1280px wide
      height: "1000px",
      zoom: 0.39,              // 👈 Visually scale it down (adjust this)
      transformOrigin: "top left",
    }}
  >
    <iframe
      src={SITE_URL}
      title="Profile Site"
      className="border-none"
      style={{
        width: "1280px",
        height: "1000px",
        pointerEvents: "auto",
      }}
    />
  </div>
</div>



        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import AboutMe from "@/components/views/AboutMe";
import Projects from "@/components/views/Projects";
import Contact from "@/components/views/Contact";

const files = [
  { name: "about.md", component: <AboutMe /> },
  { name: "projects.tsx", component: <Projects /> },
  { name: "contact.json", component: <Contact /> },
];

export default function GithubScreen() {
  const [selectedFile, setSelectedFile] = useState(files[0].name);

  const renderContent = () => {
    const file = files.find(f => f.name === selectedFile);
    return file ? file.component : <p>File not found.</p>;
  };

  return (
    <div className="flex h-full w-full bg-[#0d1117] text-white font-mono rounded-lg overflow-hidden">
      {/* File Explorer */}
      <aside className="w-1/4 border-r border-gray-700 p-4 bg-[#161b22]">
        <h2 className="text-sm mb-2 text-gray-400">Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              <button
                onClick={() => setSelectedFile(file.name)}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-700 ${
                  selectedFile === file.name ? "bg-gray-800 text-white" : "text-gray-400"
                }`}>
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* File Preview */}
      <main className="w-3/4 p-4 overflow-auto">
        <div className="text-xs text-gray-400 mb-2">{selectedFile}</div>
        <div>{renderContent()}</div>
      </main>
    </div>
  );
}

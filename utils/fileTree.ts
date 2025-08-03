export type FileNode = {
    name: string;
    path: string;
    children?: FileNode[];
    type: "file" | "folder";
  };
  
  export function buildFileTree(paths: string[]): FileNode[] {
    const root: { [key: string]: any } = {};
  
    for (const path of paths) {
      const parts = path.split("/");
      let current = root;
  
      for (let i = 0; i < parts.length; i++) {
        const name = parts[i];
        const isFile = i === parts.length - 1;
  
        if (!current[name]) {
          current[name] = {
            name,
            path: parts.slice(0, i + 1).join("/"),
            type: isFile ? "file" : "folder",
            ...(isFile ? {} : { children: {} }),
          };
        }
  
        if (!isFile) {
          current = current[name].children;
        }
      }
    }
  
    const convert = (node: any): FileNode => ({
      name: node.name,
      path: node.path,
      type: node.type,
      children: node.children
        ? Object.values(node.children)
            .map(convert)
            .sort((a, b) => {
              // First sort by type: folders before files
              if (a.type !== b.type) {
                return a.type === "folder" ? -1 : 1;
              }
              // Then sort alphabetically within each type
              return a.name.localeCompare(b.name);
            })
        : undefined,
    });
  
    return Object.values(root)
      .map(convert)
      .sort((a, b) => {
        // First sort by type: folders before files
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        // Then sort alphabetically within each type
        return a.name.localeCompare(b.name);
      });
  }
  
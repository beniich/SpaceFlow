import { useState, useCallback } from "react";
import "./ElementTree.css";

function TreeNode({ node, depth, selectedId, onSelect, expanded, toggleExpand }) {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isAsset  = node.type === "asset";
  const isFloor  = node.type === "floor";
  const isFolder = node.type === "folder" || node.type === "system";

  const handleClick = () => {
    if (hasChildren) toggleExpand(node.id);
    if (isAsset || isFloor) onSelect(node.id);
  };

  const cls = [
    "bim-tree-node",
    isSelected && "bim-tree-node--selected",
    isAsset    && "bim-tree-node--asset",
  ].filter(Boolean).join(" ");

  const icon = isFolder ? "▢" : isFloor ? "▭" : isAsset ? "▣" : "•";
  const iconCls = isAsset ? "icon-asset" : isFloor ? "icon-floor" : "icon-folder";

  return (
    <div className="bim-tree-node-wrap">
      <div
        className={cls}
        onClick={handleClick}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        tabIndex={0}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      >
        <span className="bim-tree-node__chevron">
          {hasChildren ? (isExpanded ? "▾" : "▸") : ""}
        </span>
        <span className={`bim-tree-node__icon ${iconCls}`}>{icon}</span>
        <span className="bim-tree-node__name">{node.name}</span>
        {node.status === "operational" && (
          <span className="bim-tree-node__dot" aria-label="Operational" />
        )}
        {node.count != null && (
          <span className="bim-tree-node__count">{node.count}</span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expanded={expanded}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function filterTree(node, query) {
  if (!query) return node;
  const matches = node.name?.toLowerCase().includes(query.toLowerCase());
  const kids = (node.children || []).map(c => filterTree(c, query)).filter(Boolean);
  if (matches || kids.length > 0) return { ...node, children: kids };
  return null;
}

export function ElementTree({ tree, selectedId, onSelect, searchQuery = "", onSearchChange }) {
  const [expanded, setExpanded] = useState(
    () => new Set(["building-root","floors-folder","l2","hvac-folder","pipes-folder","electrical-folder"])
  );

  const toggleExpand = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const filtered = filterTree(tree, searchQuery);

  return (
    <div className="bim-element-tree">
      <div className="bim-tree-header">
        <h3 className="bim-tree-title">
          <span className="bim-tree-title__icon">⊞</span>
          IFC Element Tree
        </h3>
        <button className="bim-tree-action" aria-label="Tree options">⋮</button>
      </div>

      <div className="bim-tree-search">
        <span className="bim-tree-search__icon">⌕</span>
        <input
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="bim-tree-search__input"
        />
      </div>

      <div className="bim-tree-content">
        {!filtered ? (
          <div className="bim-tree-empty">No elements match "{searchQuery}"</div>
        ) : (
          <TreeNode
            node={filtered}
            depth={0}
            selectedId={selectedId}
            onSelect={onSelect}
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        )}
      </div>
    </div>
  );
}

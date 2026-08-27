import React, { useEffect, useState } from "react";

interface VersionsManifest {
  latest: string;
  versions: string[];
  preview: boolean;
}

// versions.json lives at the site root (/decky-ui-kit/versions.json), not
// under the current version's own base path — every deployed version reads
// the same, always-current manifest. Cache-busted so a just-published
// version shows up immediately instead of waiting out the CDN's 10-minute
// cache-control on this file.
const MANIFEST_URL = "/decky-ui-kit/versions.json";

export const VersionSwitcher: React.FC = () => {
  const [manifest, setManifest] = useState<VersionsManifest | null>(null);

  useEffect(() => {
    fetch(`${MANIFEST_URL}?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setManifest)
      .catch(() => setManifest(null));
  }, []);

  const current = __DEMO_VERSION__;
  const options = manifest ? [...manifest.versions] : [];
  if (manifest?.preview && !options.includes("preview")) options.push("preview");
  if (!options.includes(current)) options.unshift(current);

  return (
    <select
      value={current}
      onChange={(e) => {
        window.location.href = `/decky-ui-kit/${e.target.value}/`;
      }}
      style={{
        background: "#1a1f26",
        color: "#e6eaed",
        border: "1px solid #3a4048",
        borderRadius: 4,
        padding: "4px 8px",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {options.map((v) => (
        <option key={v} value={v}>
          {v === "preview" ? "preview (unreleased)" : v === manifest?.latest ? `${v} (latest)` : v}
        </option>
      ))}
    </select>
  );
};

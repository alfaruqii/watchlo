"use client";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { Provider } from "@/types/movies.type";

type EmbededProps = {
  id: string;
  type: "movie" | "tv";
  season?: string;
  ep?: string;
};

const sourcesMap: Provider[] = JSON.parse(
  process.env.NEXT_PUBLIC_WATCHLO_SOURCE_EMBED || "[]"
);

function generateUrl(
  base: string,
  type: string,
  id: string,
  season: string,
  ep: string
) {
  return type?.toLowerCase() === "movie"
    ? `${base}/movie/${id}`
    : `${base}/tv/${id}/${season}/${ep}`;
}

function Embeded({ id, type, season = "1", ep = "1" }: EmbededProps) {
  const initialProvider =
    sourcesMap.length > 0
      ? sourcesMap[0]
      : {
          name: "vidsrc.xyz",
          label: "Initial Stream",
          url: "https://vidsrc.to",
        };
  const [provider, setProvider] = useState(initialProvider);
  console.log("provider: ", generateUrl(provider.url, type, id, season, ep));

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleProviderChange = (providerName: string) => {
    const selectedProvider = sourcesMap.find(
      (source) => source.name === providerName
    );
    setProvider(selectedProvider || sourcesMap[0]);
  };

  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            iframeWindow.onbeforeunload = (e: BeforeUnloadEvent) => {
              e.preventDefault();
            };
          }
        } catch (error) {
          console.error("Error setting up iframe redirect prevention:", error);
        }
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", handleIframeLoad);
    }
  }, [provider]);

  return (
    <div
      className={`mt-4 flex flex-col w-full ${
        type.toLowerCase() === "tv" ? "col-span-3" : ""
      }`}
    >
      {/* Iframe at the top */}
      {type.toLowerCase() === "movie" && (
        <p className="text-center w-full text-xl mb-2 font-bold">Watch 🎬</p>
      )}
      <iframe
        ref={iframeRef}
        src={generateUrl(provider.url, type, id, season, ep)}
        allowFullScreen
        className="w-full h-full rounded aspect-video drop-shadow-lg mb-4"
      />

      {/* Provider changer below the iframe */}
      <div className="flex items-center justify-between">
        <div className="dropdown dropdown-top rounded">
          <label tabIndex={0} className="btn btn-ghost">
            <AiOutlineSetting className="w-6 h-6 mr-2" />
            <span>{provider.label}</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {sourcesMap.map((source, index) => (
              <li key={index}>
                <a onClick={() => handleProviderChange(source.name)}>
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Embeded;

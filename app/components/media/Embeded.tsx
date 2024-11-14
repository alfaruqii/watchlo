"use client";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import sourcesMap from "@/data/watchlo-source.json";
import { Provider } from "@/types/movies.type";

type EmbededProps = {
  id: string;
  type: "movie" | "tv";
  season?: string;
  ep?: string;
};

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
  const [provider, setProvider] = useState<Provider>(initialProvider);
  console.log("provider: ", generateUrl(provider.url, type, id, season, ep));

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleProviderChange = (providerName: string) => {
    const selectedProvider = sourcesMap.find(
      (source) => source.name === providerName
    );
    setProvider(selectedProvider || sourcesMap[0]);
  };

  const doesTV = type?.toLowerCase() === "tv";

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
      className={`${doesTV ? "col-span-3" : ""} mt-4 flex w-full
      flex-col`}
    >
      {/* Iframe at the top */}
      {type.toLowerCase() === "movie" && (
        <p className="mb-2 w-full text-center text-xl font-bold">Watch 🎬</p>
      )}
      <iframe
        ref={iframeRef}
        src={generateUrl(provider.url, type, id, season, ep)}
        allowFullScreen
        className="mb-4 aspect-video h-full w-full rounded drop-shadow-lg"
      />

      {/* Provider changer below the iframe */}
      <div className="flex items-center justify-between">
        <div
          className={`${
            doesTV ? "dropdown-bottom sm:dropdown-top" : "dropdown-top"
          }
          dropdown rounded`}
        >
          <label
            tabIndex={0}
            className="btn btn-ghost rounded border border-base-300 px-4 text-xs"
          >
            <AiOutlineSetting className="size-4" />
            <span>{provider.label}</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 text-xs shadow"
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

"use client";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import sourcesMap from "@/data/watchlo-source.json";
import { Provider } from "@/types/movies.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded px-4 text-xs">
              <AiOutlineSetting className="size-4" />
              <span>{provider.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-10 w-52 p-2 text-xs">
            {sourcesMap.map((source, index) => (
              <DropdownMenuItem key={index} onClick={() => handleProviderChange(source.name)}>
                {source.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Embeded;

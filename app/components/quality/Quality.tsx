import { Source } from '../../types/anime.type'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function Quality({ sources, handleQualityChange }: { sources: Source[]; handleQualityChange: (url: string) => void }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="m-1">Quality video</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 p-2">
          {sources.map((source) => (
            <DropdownMenuItem key={source.quality} onClick={() => handleQualityChange(source.url)}>
              {source.quality}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Quality

import { Source } from '../../types/anime.type'
import React from 'react'

function Quality({ sources, handleQualityChange }: { sources: Source[]; handleQualityChange: (url: string) => void }) {
  return (
    <>
      <div className="dropdown dropdown-top sm:dropdown-top z-40">
        <div tabIndex={0} role="button" className="btn m-1">Quality video</div>
        <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
          {
            sources.map((source) => (
              <li key={source.quality} onClick={() => handleQualityChange(source.url)}>
                <a>{source.quality}</a>
              </li>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Quality

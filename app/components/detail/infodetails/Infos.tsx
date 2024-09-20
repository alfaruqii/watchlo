type Infos = {
  topic: string;
  value: string | number;
  customTheme?: string;
}

function Infos({ topic, value, customTheme }: Infos) {
  return (
    <>
      <div className="flex w-full justify-between">
        <p>
          {topic}
        </p>
        <p className={`${customTheme}`}>
          {value ?? "uknown"}
        </p>
      </div>
    </>
  )
}

export default Infos

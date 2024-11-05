type Infos = {
  topic: string;
  value?: string | number;
  customTheme?: string;
};

function Infos({ topic, value, customTheme }: Infos) {
  return (
    <>
      <div className="flex w-full justify-between">
        <p className="font-semibold">{topic}</p>
        <p
          className={`${customTheme} max-w-64 text-right line-clamp-1 capitalize sm:max-w-full`}
        >
          {value ?? "unknown"}
        </p>
      </div>
    </>
  );
}

export default Infos;

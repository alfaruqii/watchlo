export const getUrl = (env: string): string | undefined => {
  return process.env['NEXT_' + env];
};


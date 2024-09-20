export const getEnv = (env: string): string | undefined => {
  return process.env['NEXT_' + env];
};


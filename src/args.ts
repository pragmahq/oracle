function requireArg(name: string, index: number, required: boolean): string {
  const value = process.argv[index];
  if (required && value === undefined) {
    throw new Error(`Argument number ${index} with name ${name} is required`);
  }
  return value;
}

const ARGS = {
  DEVMODE: requireArg("DEVMODE", 2, false),
};

export default ARGS;

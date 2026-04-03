const required = (value: string | undefined, key: string, defaultValue?: string) => {
  if (!value) {
    if (defaultValue) {
      console.warn(
        `[config] Missing environment variable: ${key}. Using default value: ${defaultValue}\n` +
        `Please create a .env file in the project root with ${key} set.\n` +
        `Example: ${key}=https://api.example.com`
      );
      return defaultValue;
    }
    throw new Error(
      `[config] Missing environment variable: ${key}\n` +
      `Please create a .env file in the project root with ${key} set.\n` +
      `Example: ${key}=https://api.example.com`
    );
  }
  return value;
};

export const config = {
  BASE_URL: required(
    process.env.EXPO_PUBLIC_BASE_URL,
    "EXPO_PUBLIC_BASE_URL",
    "https://unit-project-server.gptmate.xyz/" // Default placeholder from Valoro projects
  ),
  DEFAULT_LOCALE: "ar",
};

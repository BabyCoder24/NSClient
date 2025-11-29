type MessageSource = {
  message?: unknown;
  detail?: unknown;
  error?: unknown;
  title?: unknown;
  data?: unknown;
  response?: MessageSource;
};

const preferredKeys: Array<keyof MessageSource> = [
  "message",
  "detail",
  "error",
  "title",
];

const extractFromValue = (value: unknown): string | undefined => {
  if (!value) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  if (typeof value === "object") {
    const source = value as MessageSource;
    for (const key of preferredKeys) {
      const candidate = source[key];
      if (typeof candidate === "string") {
        const trimmed = candidate.trim();
        if (trimmed) {
          return trimmed;
        }
      }
    }
  }

  return undefined;
};

/**
 * Normalizes success/error payloads coming from Axios responses so that any server-provided
 * message surfaces consistently before falling back to client defaults.
 */
export const resolveApiMessage = (
  source: unknown,
  fallback: string
): string => {
  const layeredSources: unknown[] = [];

  if (source && typeof source === "object") {
    const sourceObject = source as MessageSource;
    layeredSources.push(sourceObject.response?.data);
    layeredSources.push(sourceObject.response);
    layeredSources.push(sourceObject.data);
  }

  layeredSources.push(source);

  for (const candidate of layeredSources) {
    const message = extractFromValue(candidate);
    if (message) {
      return message;
    }
  }

  return fallback;
};

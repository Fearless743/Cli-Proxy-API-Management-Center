import type { Config, OpenAIProviderConfig } from '@/types';
import type { SponsorProviderRaw } from './types';

export const COMMANDCODE_PROVIDER_NAME = 'commandcode';
export const COMMANDCODE_DISPLAY_NAME = 'CommandCode';
export const COMMANDCODE_AFFILIATE_URL = 'https://commandcode.ai/';
export const COMMANDCODE_BASE_URL = 'https://api.commandcode.ai';
export const COMMANDCODE_OPENAI_BASE_URL = `${COMMANDCODE_BASE_URL}/v1`;
export const COMMANDCODE_CODEX_BASE_URL = COMMANDCODE_OPENAI_BASE_URL;
export const COMMANDCODE_ANTHROPIC_BASE_URL = COMMANDCODE_BASE_URL;
export const COMMANDCODE_GEMINI_BASE_URL = COMMANDCODE_BASE_URL;

export const COMMANDCODE_BASE_URL_OPTIONS = [
  {
    id: 'standard',
    baseUrl: COMMANDCODE_BASE_URL,
    openaiBaseUrl: COMMANDCODE_OPENAI_BASE_URL,
    codexBaseUrl: COMMANDCODE_CODEX_BASE_URL,
    anthropicBaseUrl: COMMANDCODE_ANTHROPIC_BASE_URL,
    geminiBaseUrl: COMMANDCODE_GEMINI_BASE_URL,
  },
] as const;

export const COMMANDCODE_PROTOCOL_LABELS = ['openai'] as const;

const normalizeText = (value: string | undefined | null): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const normalizeBaseUrl = (value: string | undefined | null): string =>
  normalizeText(value).replace(/\/+$/, '');

export const resolveCommandCodeBaseUrl = (
  value: string | undefined | null
): string => {
  const normalized = normalizeBaseUrl(value);
  const matched = COMMANDCODE_BASE_URL_OPTIONS.find(
    (option) =>
      normalized === normalizeBaseUrl(option.baseUrl) ||
      normalized === normalizeBaseUrl(option.openaiBaseUrl) ||
      normalized === normalizeBaseUrl(option.codexBaseUrl) ||
      normalized === normalizeBaseUrl(option.anthropicBaseUrl) ||
      normalized === normalizeBaseUrl(option.geminiBaseUrl)
  );
  return matched?.baseUrl ?? COMMANDCODE_BASE_URL;
};

export const getCommandCodeProtocolUrls = (value: string | undefined | null) => {
  const baseUrl = resolveCommandCodeBaseUrl(value);
  const matched =
    COMMANDCODE_BASE_URL_OPTIONS.find(
      (option) => normalizeBaseUrl(option.baseUrl) === normalizeBaseUrl(baseUrl)
    ) ?? COMMANDCODE_BASE_URL_OPTIONS[0];
  return {
    anthropic: matched.anthropicBaseUrl,
    openai: matched.openaiBaseUrl,
    codex: matched.codexBaseUrl,
    gemini: matched.geminiBaseUrl,
  };
};

const matchesCommandCodeOpenAIBaseUrl = (
  value: string | undefined | null
): boolean => {
  const normalized = normalizeBaseUrl(value);
  return COMMANDCODE_BASE_URL_OPTIONS.some(
    (option) =>
      normalized === normalizeBaseUrl(option.openaiBaseUrl) ||
      normalized === normalizeBaseUrl(option.codexBaseUrl)
  );
};

export const isCommandCodeOpenAIProvider = (
  config: OpenAIProviderConfig | undefined | null
): boolean => {
  if (!config) return false;
  return (
    normalizeText(config.name) === normalizeText(COMMANDCODE_PROVIDER_NAME) ||
    matchesCommandCodeOpenAIBaseUrl(config.baseUrl)
  );
};

export const buildCommandCodeRaw = (
  config: Config | null | undefined
): SponsorProviderRaw => ({
  openai: (config?.openaiCompatibility ?? [])
    .map((item, index) => ({ config: item, index }))
    .filter((item) => isCommandCodeOpenAIProvider(item.config)),
  claude: [],
  codex: [],
  gemini: [],
});
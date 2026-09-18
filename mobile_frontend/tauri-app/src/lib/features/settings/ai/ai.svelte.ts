import { readValue, writeValue } from '$lib/features/core/storage'

export type Capability = 'text' | 'vision' | 'reasoning' | 'tts'

export interface Provider {
  id: string
  name: string
  description: string
}

export interface AIModel {
  id: string
  name: string
  providerId: string
  capabilities: Capability[]
}

export type UseCase = 'chat' | 'vision' | 'reasoning' | 'tts'

export const USE_CASE_LABELS: Record<UseCase, string> = {
  chat: 'Chat Model',
  vision: 'Vision Model',
  reasoning: 'Reasoning Model',
  tts: 'TTS Model',
}

export const PROVIDERS: Provider[] = [
  { id: 'together', name: 'Together AI', description: 'Open-source models at scale' },
  { id: 'openai', name: 'OpenAI', description: 'GPT and o-series models' },
  { id: 'deepseek', name: 'DeepSeek', description: 'Reasoning and chat models' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude models' },
  { id: 'gemini', name: 'Gemini', description: 'Google multimodal models' },
  { id: 'openrouter', name: 'OpenRouter', description: 'One API for many models' },
  { id: 'kimi', name: 'Kimi', description: 'Moonshot long-context models' },
]

// Placeholder catalogue. Replace with a backend call per provider once the
// models endpoint exists — the shape is what the UI expects.
const PLACEHOLDER_MODELS: Record<string, AIModel[]> = {
  together: [
    { id: 'together-llama-3.3-70b', name: 'Llama 3.3 70B', providerId: 'together', capabilities: ['text'] },
    { id: 'together-qwen-2.5-72b', name: 'Qwen 2.5 72B', providerId: 'together', capabilities: ['text'] },
    { id: 'together-deepseek-r1', name: 'DeepSeek R1 Distill', providerId: 'together', capabilities: ['text', 'reasoning'] },
    { id: 'together-llama-3.2-vision', name: 'Llama 3.2 11B Vision', providerId: 'together', capabilities: ['text', 'vision'] },
  ],
  openai: [
    { id: 'openai-gpt-5.6-luna', name: 'GPT-5.6 Luna', providerId: 'openai', capabilities: ['text', 'vision'] },
    { id: 'openai-gpt-5.6-sol', name: 'GPT-5.6 Sol', providerId: 'openai', capabilities: ['text', 'vision', 'reasoning'] },
    { id: 'openai-gpt-5.6-pro', name: 'GPT-5.6 Pro', providerId: 'openai', capabilities: ['text', 'reasoning'] },
    { id: 'openai-tts-1', name: 'TTS-1', providerId: 'openai', capabilities: ['tts'] },
    { id: 'openai-gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', providerId: 'openai', capabilities: ['tts'] },
  ],
  deepseek: [
    { id: 'deepseek-v3', name: 'DeepSeek V3', providerId: 'deepseek', capabilities: ['text'] },
    { id: 'deepseek-r1', name: 'DeepSeek R1', providerId: 'deepseek', capabilities: ['text', 'reasoning'] },
  ],
  anthropic: [
    { id: 'anthropic-claude-sonnet', name: 'Claude Sonnet', providerId: 'anthropic', capabilities: ['text', 'vision'] },
    { id: 'anthropic-claude-opus', name: 'Claude Opus', providerId: 'anthropic', capabilities: ['text', 'vision', 'reasoning'] },
  ],
  gemini: [
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', providerId: 'gemini', capabilities: ['text', 'vision', 'reasoning'] },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', providerId: 'gemini', capabilities: ['text', 'vision'] },
    { id: 'gemini-tts', name: 'Gemini TTS', providerId: 'gemini', capabilities: ['tts'] },
  ],
  openrouter: [
    { id: 'openrouter-auto', name: 'Auto Router', providerId: 'openrouter', capabilities: ['text'] },
    { id: 'openrouter-llama-3.3-70b', name: 'Llama 3.3 70B', providerId: 'openrouter', capabilities: ['text'] },
    { id: 'openrouter-mistral-large', name: 'Mistral Large', providerId: 'openrouter', capabilities: ['text'] },
  ],
  kimi: [
    { id: 'kimi-k2', name: 'Kimi K2', providerId: 'kimi', capabilities: ['text', 'reasoning'] },
    { id: 'kimi-moonshot-128k', name: 'Moonshot V1 128K', providerId: 'kimi', capabilities: ['text'] },
  ],
}

interface AIState {
  keys: Record<string, string>
  models: Record<string, AIModel[]>
  defaults: Record<UseCase, string | null>
}

const KEY = 'ai-providers'

function seed(): AIState {
  return {
    keys: {},
    models: {},
    defaults: { chat: null, vision: null, reasoning: null, tts: null },
  }
}

function createAI() {
  let state = $state<AIState>(seed())
  let ready = $state(false)

  async function init() {
    const stored = await readValue<AIState>(KEY)
    if (stored?.keys) {
      state = { ...seed(), ...stored, defaults: { ...seed().defaults, ...(stored.defaults ?? {}) } }
    }
    ready = true
  }

  async function persist() {
    await writeValue(KEY, state)
  }

  function providerById(id: string) {
    return PROVIDERS.find((p) => p.id === id) ?? null
  }

  function keyFor(providerId: string) {
    return state.keys[providerId] ?? ''
  }

  function isConnected(providerId: string) {
    return (state.keys[providerId] ?? '').trim().length > 0
  }

  function maskedKey(providerId: string) {
    const key = keyFor(providerId).trim()
    if (!key) return ''
    if (key.length <= 6) return '••••••'
    return `${key.slice(0, 3)}••••••${key.slice(-4)}`
  }

  function modelsFor(providerId: string) {
    return state.models[providerId] ?? []
  }

  function connectedProviders() {
    return PROVIDERS.filter((p) => isConnected(p.id))
  }

  function allModels() {
    return connectedProviders().flatMap((p) => modelsFor(p.id))
  }

  function modelsByCapability(capability: Capability) {
    return allModels().filter((m) => m.capabilities.includes(capability))
  }

  function modelById(id: string | null) {
    return id ? allModels().find((m) => m.id === id) ?? null : null
  }

  /** Mock validation + "fetch". Returns false when the key is rejected. */
  async function setKey(providerId: string, key: string): Promise<boolean> {
    const trimmed = key.trim()
    if (trimmed.length < 8) return false
    state = {
      ...state,
      keys: { ...state.keys, [providerId]: trimmed },
      models: { ...state.models, [providerId]: PLACEHOLDER_MODELS[providerId] ?? [] },
    }
    await persist()
    return true
  }

  async function removeKey(providerId: string) {
    const keys = { ...state.keys }
    const models = { ...state.models }
    delete keys[providerId]
    delete models[providerId]
    const stillValid = (id: string | null) => (id && allModelsIn(models, keys).some((m) => m.id === id) ? id : null)
    state = {
      keys,
      models,
      defaults: {
        chat: stillValid(state.defaults.chat),
        vision: stillValid(state.defaults.vision),
        reasoning: stillValid(state.defaults.reasoning),
        tts: stillValid(state.defaults.tts),
      },
    }
    await persist()
  }

  function allModelsIn(models: Record<string, AIModel[]>, keys: Record<string, string>) {
    return Object.keys(keys)
      .filter((id) => (keys[id] ?? '').trim().length > 0)
      .flatMap((id) => models[id] ?? [])
  }

  async function setDefault(useCase: UseCase, modelId: string) {
    state = { ...state, defaults: { ...state.defaults, [useCase]: modelId } }
    await persist()
  }

  return {
    get ready() { return ready },
    get defaults() { return state.defaults },
    init,
    providerById,
    keyFor,
    isConnected,
    maskedKey,
    modelsFor,
    connectedProviders,
    allModels,
    modelsByCapability,
    modelById,
    setKey,
    removeKey,
    setDefault,
  }
}

export const ai = createAI()

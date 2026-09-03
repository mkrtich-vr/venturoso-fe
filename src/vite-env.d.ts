/// <reference types="vite/client" />

/**
 * Typing the env vars we actually use. Without this augmentation Vite's own
 * `ImportMetaEnv` carries an `[key: string]: any` index signature, so every
 * `import.meta.env` read would be `any` and defeat the type-aware lint rules.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

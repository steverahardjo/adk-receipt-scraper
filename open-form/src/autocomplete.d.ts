declare module '@/../autocomplete/pkg/autocomplete.js' {
  export class WasmAutocomplete {
    constructor()
    static with_config(
      max_results: number,
      use_wheeler: boolean,
      wheeler_max_distance: number,
      prefix_boost: number
    ): WasmAutocomplete

    init_from_protobuf(data: string): boolean
    add_words_json(json: string): void
    query(query: string): string
    query_protobuf(request_data: string): string
    prefix_query(query: string, max_results: number): string
    wheeler_query(query: string, max_distance: number): string
    word_count(): number
    clear(): void
    set_config(
      max_results: number,
      use_wheeler: boolean,
      wheeler_max_distance: number,
      prefix_boost: number
    ): void
    free(): void
  }

  export default function init(
    module_or_path?: string | URL | Request | WebAssembly.Module
  ): Promise<any>
}

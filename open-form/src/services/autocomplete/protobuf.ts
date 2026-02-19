/**
 * Protobuf message types for autocomplete service
 * These match the Rust protobuf definitions in autocomplete/proto/autocomplete.proto
 */

export interface WordEntry {
  term: string
  frequency: number
  tags: string[]
}

export interface WordBatch {
  entries: WordEntry[]
}

export interface AutocompleteRequest {
  query: string
  max_results: number
  use_wheeler: boolean
  wheeler_max_distance: number
}

export interface AutocompleteResult {
  term: string
  score: number
  is_prefix_match: boolean
  is_wheeler_match: boolean
}

export interface AutocompleteResponse {
  results: AutocompleteResult[]
  prefix_matches: number
  wheeler_matches: number
}

/**
 * Simple protobuf encoder/decoder for the autocomplete messages
 * This is a minimal implementation - in production you might use protobufjs
 */
export class ProtobufCodec {
  /**
   * Encode a WordBatch to a Uint8Array
   */
  static encodeWordBatch(batch: WordBatch): Uint8Array {
    const encoder = new TextEncoder()
    
    // Encode each entry
    const entriesData = batch.entries.map(entry => {
      const termBytes = encoder.encode(entry.term)
      const tagsBytes = entry.tags.map(tag => encoder.encode(tag))
      
      // Field 1: term (string = length-delimited)
      const termField = new Uint8Array([0x0a]) // field 1, wire type 2
      
      // Field 2: frequency (uint32 = varint)
      const freqField = Number(entry.frequency << 3) // field 2, wire type 0
      
      // Field 3: tags (repeated string)
      const tagsFields = tagsBytes.map((tagBytes) => {
        const tagField = new Uint8Array([0x1a]) // field 3, wire type 2
        const lengthVarint = ProtobufCodec.encodeVarint(tagBytes.length)
        return ProtobufCodec.concatUint8Arrays([tagField, lengthVarint, tagBytes])
      })
      
      const entryContent = this.concatUint8Arrays([
        termField,
        this.encodeVarint(termBytes.length),
        termBytes,
        new Uint8Array([freqField & 0xff]), // Ensure it fits in a byte
        ...tagsFields
      ])
      
      // Field 1: entries (message = length-delimited)
      return this.concatUint8Arrays([
        new Uint8Array([0x0a]), // field 1, wire type 2
        this.encodeVarint(entryContent.length),
        entryContent
      ])
    })
    
    return this.concatUint8Arrays(entriesData)
  }
  
  /**
   * Decode AutocompleteResponse from base64 string
   */
  static decodeResponse(base64: string): AutocompleteResponse {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    
    return this.parseAutocompleteResponse(bytes)
  }
  
  /**
   * Encode a single protobuf field
   */
  private static encodeField(fieldNum: number, type: 'bytes' | 'string', contentLength: number): Uint8Array {
    const tag = (fieldNum << 3) | 2 // wire type 2 for length-delimited
    return new Uint8Array([tag])
  }
  
  /**
   * Encode a varint
   */
  private static encodeVarint(value: number): Uint8Array {
    const bytes: number[] = []
    let v = value
    while (v > 0x7f) {
      bytes.push((v & 0x7f) | 0x80)
      v >>>= 7
    }
    bytes.push(v)
    return new Uint8Array(bytes)
  }
  
  /**
   * Concatenate multiple Uint8Arrays
   */
  private static concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const arr of arrays) {
      result.set(arr, offset)
      offset += arr.length
    }
    return result
  }
  
  /**
   * Parse AutocompleteResponse from bytes
   */
  private static parseAutocompleteResponse(bytes: Uint8Array): AutocompleteResponse {
    const response: AutocompleteResponse = {
      results: [],
      prefix_matches: 0,
      wheeler_matches: 0
    }

    let i = 0
    while (i < bytes.length) {
      const tag = bytes[i++]
      if (tag === undefined) break
      const fieldNum = tag >>> 3
      const wireType = tag & 0x07

      if (fieldNum === 1 && wireType === 2) {
        // results (repeated message)
        const length = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        const result = this.parseAutocompleteResult(bytes.slice(i, i + length))
        response.results.push(result)
        i += length
      } else if (fieldNum === 2 && wireType === 0) {
        // prefix_matches (varint)
        const result = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        response.prefix_matches = result
      } else if (fieldNum === 3 && wireType === 0) {
        // wheeler_matches (varint)
        const result = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        response.wheeler_matches = result
      } else {
        // Skip unknown field
        this.skipField(bytes, i, wireType)
      }
    }

    return response
  }
  
  /**
   * Parse a single AutocompleteResult
   */
  private static parseAutocompleteResult(bytes: Uint8Array): AutocompleteResult {
    const result: AutocompleteResult = {
      term: '',
      score: 0,
      is_prefix_match: false,
      is_wheeler_match: false
    }

    let i = 0
    while (i < bytes.length) {
      const tag = bytes[i++]
      if (tag === undefined) break
      const fieldNum = tag >>> 3
      const wireType = tag & 0x07

      if (fieldNum === 1 && wireType === 2) {
        // term (string)
        const length = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        result.term = new TextDecoder().decode(bytes.slice(i, i + length))
        i += length
      } else if (fieldNum === 2 && wireType === 0) {
        // score (varint)
        const score = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        result.score = score
      } else if (fieldNum === 3 && wireType === 0) {
        // is_prefix_match (varint as bool)
        const val = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        result.is_prefix_match = val !== 0
      } else if (fieldNum === 4 && wireType === 0) {
        // is_wheeler_match (varint as bool)
        const val = this.decodeVarint(bytes, i)
        i += this.getVarintLength(bytes, i)
        result.is_wheeler_match = val !== 0
      } else {
        i++ // Skip
      }
    }

    return result
  }
  
  /**
   * Decode a varint from bytes
   */
  private static decodeVarint(bytes: Uint8Array, offset: number): number {
    let result = 0
    let shift = 0
    let i = offset
    while (true) {
      const byte = bytes[i++]
      if (byte === undefined) break
      result |= (byte & 0x7f) << shift
      if ((byte & 0x80) === 0) break
      shift += 7
    }
    return result
  }

  /**
   * Get the length in bytes of a varint
   */
  private static getVarintLength(bytes: Uint8Array, offset: number): number {
    let length = 0
    let i = offset
    while (true) {
      const byte = bytes[i++]
      if (byte === undefined) break
      length++
      if ((byte & 0x80) === 0) break
    }
    return length
  }

  /**
   * Skip a field based on wire type
   */
  private static skipField(bytes: Uint8Array, offset: number, wireType: number): void {
    if (wireType === 0) {
      // Varint
      while (true) {
        const byte = bytes[offset++]
        if (byte === undefined || (byte & 0x80) === 0) break
      }
    } else if (wireType === 2) {
      // Length-delimited
      const length = this.decodeVarint(bytes, offset)
      offset += this.getVarintLength(bytes, offset) + length
    }
  }
}

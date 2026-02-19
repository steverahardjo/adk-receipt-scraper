// WASM Autocomplete Module JavaScript Bindings
// This is a simplified binding for the autocomplete WASM module

let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let WASM_STACK_LEN = 0;

function takeFromWasmStack(ptr, len) {
    WASM_STACK_LEN = len;
    return ptr;
}

function addToWasmStack(ptr, len) {
    WASM_STACK_LEN = len;
    return ptr;
}

/**
 * Main WASM Autocomplete class
 */
export class WasmAutocomplete {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.autocomplete_free(ptr);
    }

    constructor() {
        const ret = wasm.autocomplete_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }

    /**
     * Create with custom configuration
     */
    static with_config(max_results, use_wheeler, wheeler_max_distance, prefix_boost) {
        const ret = wasm.autocomplete_with_config(
            max_results,
            use_wheeler,
            wheeler_max_distance,
            prefix_boost
        );
        const instance = Object.create(WasmAutocomplete.prototype);
        instance.__wbg_ptr = ret >>> 0;
        return instance;
    }

    /**
     * Initialize from protobuf (base64 encoded)
     */
    init_from_protobuf(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.autocomplete_init_from_protobuf(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw new Error(getStringFromWasm0(ret[0], ret[1]));
        }
        return ret[0] !== 0;
    }

    /**
     * Add words from JSON string
     */
    add_words_json(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.autocomplete_add_words_json(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw new Error(getStringFromWasm0(ret[0], ret[1]));
        }
    }

    /**
     * Query for autocomplete suggestions (returns JSON string)
     */
    query(query) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.autocomplete_query(this.__wbg_ptr, ptr0, len0);
        const v1 = getStringFromWasm0(ret[0], ret[1]);
        return v1;
    }

    /**
     * Query with protobuf request/response (base64 encoded)
     */
    query_protobuf(request_data) {
        const ptr0 = passStringToWasm0(request_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.autocomplete_query_protobuf(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw new Error(getStringFromWasm0(ret[0], ret[1]));
        }
        return getStringFromWasm0(ret[0], ret[1]);
    }

    /**
     * Prefix-only query
     */
    prefix_query(query, max_results) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.autocomplete_prefix_query(this.__wbg_ptr, ptr0, len0, max_results);
        const v1 = getStringFromWasm0(ret[0], ret[1]);
        return v1;
    }

    /**
     * Wheeler-only fuzzy query
     */
    wheeler_query(query, max_distance) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.autocomplete_wheeler_query(this.__wbg_ptr, ptr0, len0, max_distance);
        const v1 = getStringFromWasm0(ret[0], ret[1]);
        return v1;
    }

    /**
     * Get word count
     */
    word_count() {
        const ret = wasm.autocomplete_word_count(this.__wbg_ptr);
        return ret >>> 0;
    }

    /**
     * Clear all data
     */
    clear() {
        wasm.autocomplete_clear(this.__wbg_ptr);
    }

    /**
     * Update configuration
     */
    set_config(max_results, use_wheeler, wheeler_max_distance, prefix_boost) {
        wasm.autocomplete_set_config(
            this.__wbg_ptr,
            max_results,
            use_wheeler,
            wheeler_max_distance,
            prefix_boost
        );
    }
}

/**
 * Initialize the WASM module
 */
export default async function init(module_or_path) {
    if (wasm !== undefined) return wasm;

    if (typeof module_or_path === 'undefined') {
        // Use default path (relative to this file)
        module_or_path = new URL('autocomplete.wasm', import.meta.url);
    }

    const imports = {
        wbg: {}
    };

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        const response = await fetch(module_or_path);
        const { instance } = await WebAssembly.instantiateStreaming(response, imports);
        wasm = instance.exports;
    } else {
        const { instance } = await WebAssembly.instantiate(module_or_path, imports);
        if (instance instanceof WebAssembly.Instance) {
            wasm = instance.exports;
        } else {
            wasm = instance;
        }
    }

    return wasm;
}

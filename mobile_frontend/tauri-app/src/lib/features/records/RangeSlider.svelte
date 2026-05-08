<script lang="ts">
  let {
    min = 0,
    max = 10000000,
    step = 10000,
    valueMin = 0,
    valueMax = max,
    onMinChange,
    onMaxChange,
  }: {
    min?: number
    max?: number
    step?: number
    valueMin?: number
    valueMax?: number
    onMinChange?: (v: number) => void
    onMaxChange?: (v: number) => void
  } = $props()

  function fmt(v: number) {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`
    return v.toString()
  }
</script>

<div class="sliders">
  <div class="slider-row">
    <span class="slider-label">Min</span>
    <span class="slider-value">Rp {fmt(valueMin)}</span>
    <input type="range" {min} {max} {step} value={valueMin} oninput={(e) => onMinChange?.(parseInt((e.target as HTMLInputElement).value))} />
  </div>
  <div class="slider-row">
    <span class="slider-label">Max</span>
    <span class="slider-value">Rp {fmt(valueMax)}</span>
    <input type="range" {min} {max} {step} value={valueMax} oninput={(e) => onMaxChange?.(parseInt((e.target as HTMLInputElement).value))} />
  </div>
</div>

<style>
  .sliders {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .slider-label {
    font-family: 'Public Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #6b7b72;
    width: 28px;
    flex-shrink: 0;
  }

  .slider-value {
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1a1c1e;
    font-variant-numeric: tabular-nums;
    width: 70px;
    flex-shrink: 0;
    text-align: right;
  }
  :global(.dark) .slider-value { color: #f0f0f3; }

  .slider-row input[type="range"] {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(0, 141, 163, 0.1);
    border-radius: 3px;
    outline: none;
  }
  :global(.dark) .slider-row input[type="range"] { background: rgba(110, 212, 236, 0.08); }

  .slider-row input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #006c50;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  :global(.dark) .slider-row input[type="range"]::-webkit-slider-thumb { border-color: #24e0ab; }

  .slider-row input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #006c50;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  :global(.dark) .slider-row input[type="range"]::-moz-range-thumb { border-color: #24e0ab; }
</style>

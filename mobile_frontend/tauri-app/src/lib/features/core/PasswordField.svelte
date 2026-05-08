<script lang="ts">
  import { validatePassword } from './passwordRules'

  let {
    value = $bindable(''),
    disabled = false,
    id = 'password',
    label = 'Password',
    placeholder = 'Enter a strong password',
  }: {
    value?: string
    disabled?: boolean
    id?: string
    label?: string
    placeholder?: string
  } = $props()

  let rules = $derived(validatePassword(value))
</script>

<div class="field">
  <label class="field-label" for={id}>{label}</label>
  <input
    {id}
    class="field-input"
    type="password"
    {placeholder}
    bind:value
    {disabled}
    autocomplete="new-password"
  />
  {#if value.length > 0}
    <div class="rules">
      <p class="rule" class:met={rules.hasLength}>
        <span class="bullet">•</span> At least 14 characters
      </p>
      <p class="rule" class:met={rules.hasUpper}>
        <span class="bullet">•</span> One uppercase letter
      </p>
      <p class="rule" class:met={rules.hasNumber}>
        <span class="bullet">•</span> One number
      </p>
      <p class="rule" class:met={rules.hasSpecial}>
        <span class="bullet">•</span> One special character
      </p>
    </div>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: #555555;
  }

  :global(.dark) .field-label {
    color: #a0a0a5;
  }

  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 1.5px solid #e5e5ea;
    border-radius: 10px;
    font-size: 15px;
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: #000000;
    background: #ffffff;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  :global(.dark) .field-input {
    border-color: #38383a;
    color: #ffffff;
    background: #1c1c1e;
  }

  .field-input:focus {
    border-color: #007aff;
  }

  :global(.dark) .field-input:focus {
    border-color: #0a84ff;
  }

  .field-input::placeholder {
    color: #aeaeb2;
  }

  .rules {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 2px;
  }

  .rule {
    margin: 0;
    font-size: 13px;
    color: #8e8e93;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .rule.met {
    color: #34c759;
  }

  :global(.dark) .rule.met {
    color: #30d158;
  }

  .bullet {
    display: inline-block;
    width: 8px;
  }
</style>

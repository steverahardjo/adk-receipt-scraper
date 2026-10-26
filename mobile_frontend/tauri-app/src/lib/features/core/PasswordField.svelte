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
    color: var(--deneb-text-secondary);
  }

  /* One token set covers both themes, so the :global(.dark) pairs are gone.
     Border radius follows the shared radius scale. */
  .field-input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 1.5px solid var(--deneb-border);
    border-radius: var(--deneb-radius-sm);
    font-size: 15px;
    font-family: var(--deneb-sans);
    color: var(--deneb-ink);
    background: var(--deneb-surface);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .field-input:focus {
    border-color: var(--deneb-accent);
  }

  .field-input::placeholder {
    color: var(--deneb-text-muted);
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
    color: var(--deneb-text-secondary);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .rule.met {
    color: var(--deneb-positive);
  }

  .bullet {
    display: inline-block;
    width: 8px;
  }
</style>

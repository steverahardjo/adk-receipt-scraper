<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import BaseLayer from '$lib/BaseLayer.svelte'
  import Avatar from '$lib/features/profile/Avatar.svelte'
  import SettingsGroup from '$lib/features/settings/SettingsGroup.svelte'
  import SettingsRow from '$lib/features/settings/SettingsRow.svelte'
  import ChoiceSheet from '$lib/features/settings/ChoiceSheet.svelte'
  import { showToast } from '$lib/features/core/toast.svelte'
  import { profile } from '$lib/features/profile/profile.svelte'
  import { COUNTRY_OPTIONS } from '$lib/features/settings/settings.svelte'

  let fileInput = $state<HTMLInputElement | null>(null)
  let countryOpen = $state(false)
  let saving = $state(false)
  let initialized = $state(false)

  let form = $state({ name: '', email: '', phone: '', dob: '', country: '' })

  function syncForm() {
    form = {
      name: profile.value.name,
      email: profile.value.email,
      phone: profile.value.phone,
      dob: profile.value.dob,
      country: profile.value.country,
    }
  }

  $effect(() => {
    if (!profile.ready || initialized) return
    syncForm()
    initialized = true
  })

  function onAvatar(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast({ type: 'error', title: 'Images only' }); return }
    if (file.size > 2 * 1024 * 1024) { showToast({ type: 'error', title: 'Image must be under 2 MB' }); return }
    const reader = new FileReader()
    reader.onload = () => profile.update({ avatar: String(reader.result ?? '') })
    reader.readAsDataURL(file)
  }

  async function save() {
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast({ type: 'error', title: 'Check your details', message: 'Name and a valid email are required' })
      return
    }
    saving = true
    await profile.update({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dob: form.dob,
      country: form.country,
    })
    saving = false
    showToast({ type: 'success', title: 'Profile updated', duration: 2000 })
  }

  onMount(() => {
    if (profile.ready) { syncForm(); initialized = true }
  })
</script>

<BaseLayer title="Profile">
  <div class="page">
    <div class="hero">
      <button class="avatar-btn" onclick={() => fileInput?.click()} aria-label="Change profile picture">
        <Avatar image={profile.value.avatar} initials={profile.initials} size={88} />
        <span class="avatar-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="12" r="4" /></svg>
        </span>
      </button>
      <h1 class="hero-name">{profile.value.name}</h1>
      <p class="hero-email">{profile.value.email}</p>
      <input bind:this={fileInput} class="hidden" type="file" accept="image/*" onchange={onAvatar} />
    </div>

    <SettingsGroup title="Personal Information">
      <div class="form">
        <div class="field">
          <label class="field-label" for="pf-name">Full name</label>
          <input id="pf-name" class="field-input" type="text" bind:value={form.name} autocomplete="name" />
        </div>
        <div class="field">
          <label class="field-label" for="pf-email">Email</label>
          <input id="pf-email" class="field-input" type="email" bind:value={form.email} autocomplete="email" />
        </div>
        <div class="field">
          <label class="field-label" for="pf-phone">Phone number</label>
          <input id="pf-phone" class="field-input" type="tel" bind:value={form.phone} autocomplete="tel" />
        </div>
        <div class="field">
          <label class="field-label" for="pf-dob">Date of birth</label>
          <input id="pf-dob" class="field-input" type="date" bind:value={form.dob} />
        </div>
        <div class="field">
          <label class="field-label" for="pf-country">Country / region</label>
          <button id="pf-country" class="field-input select" onclick={() => countryOpen = true}>
            <span class:placeholder={!form.country}>{form.country || 'Select country'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>
      </div>
    </SettingsGroup>

    <button class="save-btn" onclick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>

    <SettingsGroup>
      <SettingsRow label="Settings" desc="Currency, categories, security, data" chevron onclick={() => goto('/settings')} />
    </SettingsGroup>
  </div>
</BaseLayer>

<ChoiceSheet
  opened={countryOpen}
  title="Country / region"
  options={COUNTRY_OPTIONS.map((c) => ({ value: c }))}
  value={form.country}
  onSelect={(v) => form.country = v}
  onClose={() => countryOpen = false}
/>

<style>
  .page { display: flex; flex-direction: column; gap: 22px; padding: 12px 16px 100px; }
  .hidden { display: none; }

  .hero { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 0 4px; }
  .avatar-btn { position: relative; border: none; background: none; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .avatar-btn:active { opacity: 0.85; }
  .avatar-badge {
    position: absolute; right: -2px; bottom: -2px;
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--f7-page-text-color); color: var(--f7-page-bg-color);
    border: 2px solid var(--f7-page-bg-color);
    display: flex; align-items: center; justify-content: center;
  }
  .hero-name { font-family: var(--deneb-sans); font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--f7-page-text-color); margin: 10px 0 0; }
  .hero-email { font-family: 'Geist Mono', monospace; font-size: 12px; color: var(--deneb-text-secondary); margin: 0; }

  .form { display: flex; flex-direction: column; gap: 14px; padding: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-family: 'Geist Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.02em; color: var(--deneb-text-secondary); }
  .field-input {
    width: 100%; height: 44px; padding: 0 14px;
    border: 1px solid var(--deneb-border); border-radius: 10px;
    font-family: var(--deneb-sans); font-size: 15px;
    color: var(--f7-page-text-color); background: var(--deneb-canvas);
    outline: none; transition: border-color 0.15s; box-sizing: border-box;
  }
  .field-input:focus { border-color: var(--f7-page-text-color); }
  .select { display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left; }
  .select .placeholder { color: var(--deneb-text-muted); }
  .select svg { color: var(--deneb-text-muted); }

  .save-btn {
    height: 48px; border: none; border-radius: 10px;
    background: var(--f7-page-text-color); color: var(--f7-page-bg-color);
    font-family: var(--deneb-sans); font-size: 15px; font-weight: 600;
    cursor: pointer; transition: opacity 0.15s; -webkit-tap-highlight-color: transparent;
  }
  .save-btn:disabled { opacity: 0.5; }
  .save-btn:active:not(:disabled) { opacity: 0.85; }
</style>

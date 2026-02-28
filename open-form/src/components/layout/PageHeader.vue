<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  isDarkMode: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <header class="header">
    <div class="header__top">
      <div class="header__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <button
        class="theme-toggle"
        @click="emit('toggle')"
        aria-label="Toggle dark mode"
      >
        <svg v-if="isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
      </button>
    </div>
    <h1 class="header__title">{{ title }}</h1>
    <p class="header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0b57d0 0%, #1a73e8 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(11, 87, 208, 0.3);
}

.dark-mode .header__icon {
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #5f6368;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f1f1f;
}

.dark-mode .theme-toggle {
  color: #e0e0e0;
}

.dark-mode .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.header__title {
  font-family: 'Google Sans', sans-serif;
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 0.5rem 0;
}

.dark-mode .header__title {
  color: #f0f0f0;
}

.header__subtitle {
  font-size: 0.9375rem;
  color: #5f6368;
  margin: 0;
}

.dark-mode .header__subtitle {
  color: #a0a0a0;
}
</style>

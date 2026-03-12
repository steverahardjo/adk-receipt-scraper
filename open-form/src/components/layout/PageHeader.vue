<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>

<template>
  <header class="header">
    <div class="header__content">
      <div class="header__brand">
        <div class="header__text">
          <h1 class="header__title">{{ title }}</h1>
          <p class="header__subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  margin-bottom: 2rem;
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header__brand {
  display: flex;
  flex-direction: column;
}

.header__title {
  font-family: 'Google Sans', -apple-system, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
  line-height: 1.2;
}

.header__subtitle {
  font-size: 0.875rem;
  color: #5f6368;
  margin: 0.125rem 0 0;
}

@media (max-width: 480px) {
  .header__title {
    font-size: 1.25rem;
  }

  .header__subtitle {
    font-size: 0.8125rem;
  }
}
</style>

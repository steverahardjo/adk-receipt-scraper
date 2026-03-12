<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string
  height?: string
  borderRadius?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: '1rem',
  borderRadius: '0.5rem',
})
</script>

<template>
  <div
    class="skeleton"
    :class="[`skeleton--${variant}`]"
    :style="{
      width,
      height,
      borderRadius: variant === 'circular' ? '50%' : borderRadius,
    }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base, #f0f0f0) 25%,
    var(--skeleton-highlight, #e0e0e0) 50%,
    var(--skeleton-base, #f0f0f0) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton--circular {
  border-radius: 50%;
}

.skeleton--rounded {
  border-radius: 0.5rem;
}

.skeleton--rectangular {
  border-radius: 0;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

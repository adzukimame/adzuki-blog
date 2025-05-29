<template>
  <div class="outer">
    <div class="inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.outer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
}

.inner {
  inline-size: 100%;
  margin: auto;
  padding: 1rem;
}
</style>

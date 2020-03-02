<template>
  <div class="preloader fade-out">
    <div
      v-if="$store.state.showPreloader"
      class="d-flex justify-content-center align-items-center"
    >
      <video autoplay loop muted playsinline class="preloader__video">
        <source src="../assets/loader.mp4" type="video/mp4" />
        <source src="../assets/loader.ogg" type="video/ogg" />
        <source src="../assets/loader.webm" type="video/webm" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: "preloader"
};
</script>

<style scoped="scoped">
.preloader__video {
  height: 66vh;
  width: 100%;
  object-fit: cover;
  animation-duration: 1s;
  animation-fill-mode: both;
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fade-out {
  animation-name: fade-out;
}
</style>

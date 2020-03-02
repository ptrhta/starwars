<template>
  <div class="header">
    <div class="header__bg d-flex justify-content-center align-items-center">
      <div class="header__logo">
        <img src="../assets/header__logo.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style lang="scss">
.header {
  &__bg {
    position: relative;
    height: 34vh;
    width: 100vw;
    background: no-repeat url("../assets/header__bg.png");
    background-size: cover;
    background-position: center center;
  }

  &__logo {
    img {
      max-height: 30vh;
      max-width: 406px;
    }
  }
}

@media (max-width: 767px) {
  .header {
    &__bg {
      background: no-repeat url("../assets/header__bg-middle.png");
      background-size: cover;
    }

    &__logo img {
      width: 212px;
    }
  }
}
</style>

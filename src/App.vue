<template>
  <div id="app">
    <Header />
    <Cards v-show="!$store.state.showPreloader" />
    <Popup v-if="!$store.state.closePopUp" />
    <Preloader />
    <Footer v-show="!$store.state.showPreloader" />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Cards from "./components/Cards.vue";
import Popup from "./components/Popup.vue";
import Preloader from "./components/Preloader.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Cards,
    Popup,
    Preloader,
    Footer
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/

body {
  background-color: "#1A1A1A" !important;
}
</style>

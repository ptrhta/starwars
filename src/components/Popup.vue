<template>
  <div class="popup d-flex align-items-center">
    <div class="popup__card fade-in-up" @click="$store.state.closePopUp = true">
      <button
        title="Close (Esc)"
        type="button"
        class="popup__button-close"
      >
        <img src="../assets/vector.svg" />
      </button>
      <div v-if="loadPopup" class="fade-in">
        <div class="popup__name">
          <div
            class="popup__avatar d-flex justify-content-center align-items-center"
            :style="{ 'background-color': $store.state.person.color }"
          >
            <span>{{ letterOfAvatar($store.state.person.name) }}</span>
          </div>
          {{ $store.state.person.name }}
        </div>
        <b-row class="popup__about">
          <b-col sm="12" xl="6">
            <b-row class="popup__row">
              <b-col>
                <img src="../assets/birth-icon.svg" />
                <span class="popup__position-name">Birth year</span>
              </b-col>
              <b-col>
                <span class="popup__position">{{
                  $store.state.person.birth_year
                }}</span>
              </b-col>
            </b-row>
            <b-row class="popup__row">
              <b-col>
                <img src="../assets/species-icon.svg" />
                <span class="popup__position-name">Species</span>
              </b-col>
              <b-col>
                <span class="popup__position">{{ species }}</span>
              </b-col>
            </b-row>
            <b-row class="popup__row">
              <b-col>
                <img src="../assets/gender-icon.svg" />
                <span class="popup__position-name">Gender</span>
              </b-col>
              <b-col>
                <span class="popup__position">{{
                  $store.state.person.gender
                }}</span>
              </b-col>
            </b-row>
          </b-col>

          <b-col>
            <b-row class="popup__row">
              <b-col>
                <img src="../assets/homeworld-icon.svg" />
                <span class="popup__position-name">Homeworld</span>
              </b-col>
              <b-col>
                <span class="popup__position">{{ homeworld }}</span>
              </b-col>
            </b-row>
            <b-row class="popup__row">
              <b-col>
                <img src="../assets/films-icon.svg" />
                <span class="popup__position-name">Films</span>
              </b-col>
              <b-col>
                <div
                  v-for="(film, index) in films"
                  :key="index"
                  class="popup__position"
                >
                  <span>{{ film }}</span>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>

      <div
        v-if="!loadPopup"
        class="d-flex justify-content-center align-items-center fade-out"
      >
        <video autoplay loop muted playsinline class="popup__video">
          <source src="../assets/loader.mp4" type="video/mp4" />
          <source src="../assets/loader.ogg" type="video/ogg" />
          <source src="../assets/loader.webm" type="video/webm" />
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/index.js";
import axios from "axios";

export default {
  name: "popup",
  data() {
    return {
      species: null,
      homeworld: null,
      films: null,
      loadPopup: false
    };
  },
  methods: {
    letterOfAvatar(name) {
      return name.charAt(0);
    }
  },
  mounted() {
    this.films = [];
    for (let i = 0; i < store.state.person.films.length; i++) {
      axios.get(store.state.person.films[i]).then(response => {
        this.films.push(response.data.title);
      });
    }
    axios
      .all([
        axios.get(store.state.person.species),
        axios.get(store.state.person.homeworld)
      ])
      .then(response => {
        this.species = response[0].data.name;
        this.homeworld = response[1].data.name;

        if (this.species && this.homeworld && this.films)
          setTimeout(() => {
            this.loadPopup = true;
          }, 2000);
      });
  }
};
</script>

<style lang="scss">
.popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 110vh;
  z-index: 1042;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.01);
  backdrop-filter: blur(10px);
  bottom: 0;

  &__card {
    margin: auto auto;
    position: relative;
    width: 56vw;
    max-height: 90vh;
    padding: 80px;
    z-index: 1045;
    background: #1a1a1a;
    border-radius: 8px;
    overflow: auto;
    animation-duration: 0.9s;
    animation-fill-mode: both;
  }

  &__button-close {
    position: absolute;
    width: 12px;
    height: 12px;
    right: 28px;
    top: 22px;
    margin: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    display: block;
    outline: 0;
    z-index: 1056;
    box-shadow: none;

    img {
      width: 12px;
      height: 12px;
      color: #fff;
      box-shadow: none;
    }
  
    &:focus {
      outline: none !important;
    }
  }

  &__name {
    display: flex;
    flex-direction: row;
    font-family: "Roboto";
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 80px;
    text-align: left;
    font-feature-settings: "liga" off;
    color: #ffffff;
    padding-bottom: 80px;
    border-bottom: 1px solid #808080;
  }

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-right: 16px;

    span {
      display: flex;
      align-items: center;
      text-align: center;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 500;
      font-size: 48px;
      line-height: 80px;
      font-feature-settings: "liga" off;
      color: #ffffff;
    }
  }

  &__about {
    padding-top: 71px;

    img {
      width: 20px;
    }
  }

  &__position-name {
    padding-left: 11px;
    font-family: "Roboto";
    font-style: normal;
    font-weight: normal;
    vertical-align: middle;
    font-size: 18px;
    line-height: 21px;
    font-feature-settings: "liga" off;
    color: #808080;
  }

  &__position {
    font-family: "Roboto";
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    vertical-align: middle;
    margin-bottom: 20px !important;
    font-feature-settings: "liga" off;
    color: #ffffff;

    span {
      margin-bottom: 20px !important;
    }

    &:first-letter {
      text-transform: capitalize !important;
    }
  }

  &__row {
    margin-bottom: 21px;
  }

  &__video {
    position: absolute;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    object-fit: cover;
    animation-duration: 1s;
    animation-fill-mode: both;
  }
}

@media (max-width: 1440px) {
  .popup__card {
    width: 66vw;
  }
}

@media (max-width: 767px) {
  .popup {
    height: 100vh;

    &__card {
      position: relative;
      width: 100vw;
      height: 120vh !important;
      max-height: 120vh;
      margin-top: 48px !important;
      padding-left: 24px !important;
      padding-right: 24px !important;
      margin-bottom: 68px !important;
    }

    &__name {
      font-size: 22px;
      line-height: 80px;
      padding-bottom: 48px;
    }

    &__about {
      padding-top: 49px;

      img {
        width: 20px;
      }
    }

    &__position-name {
      font-size: 16px;
      line-height: 19px;
    }

    &__position {
      font-size: 16px;
      line-height: 19px;
      vertical-align: middle;
      margin-left: -80px;
    }

    &__video {
      top: -48px;
      position: relative;
      width: 100vw;
      height: 110vh;;
    }
  }
}

@media(max-width: 420px) {
  .popup__position {
    margin-left: -20px;
  }
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

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade-in-up {
  animation-name: fade-in-up;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation-name: fade-in;
  animation-duration: 1.5s;
  animation-fill-mode: both;
}
</style>

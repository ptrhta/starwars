<template>
  <div class="cards">
    {{ numberOfColumns() }}
    <div
      class="cards__search search d-flex justify-content-between align-items-center fade-in-up"
    >
      <input
        type="text"
        @input="debouncedSearch"
        v-model="searchName"
        required
      />
      <label class="search__label">Search by name</label>
      <i class="fas fa-search"></i>
    </div>
    <div class="cards__wrapper-cards wrapper-cards">
      <div
        class="wrapper-cards__column"
        v-for="(column, columnIndex) in columnsWithItems"
        :key="columnIndex"
      >
        <div v-for="(item, itemIndex) in column" :key="itemIndex">
          <div
            class="wrapper-cards__item-container d-flex justify-content-center align-items-center fade-in-up"
            @click="onclickCard(item)"
          >
            <div
              class="wrapper-cards__avatar d-flex justify-content-center align-items-center"
              :style="{ 'background-color': item.color }"
            >
              <span>{{ letterOfAvatar(item.name) }}</span>
            </div>
            <div class="wrapper-cards__name">{{ item.name }}</div>
            <span class="wrapper-cards__species">Species</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { debounce } from "debounce";
import store from "../store/index.js";

export default {
  name: "cards",
  data() {
    return {
      post: [],
      cols: 2,
      width: null,
      showModal: false,
      scrolledToBottom: true,
      isLoadingMore: null,
      moreItems: [],
      columnsWithItems: []
    };
  },
  watch: {
    searchPeoples: function() {
      if (this.searchName == "") this.init();
      else this.columns(store.state.searchPeoples);
    },
    cols: function() {
      this.init();
    }
  },
  methods: {
    ...mapActions(["setSearchQuery", "search"]),
    debouncedSearch: debounce(function() {
      this.search();
    }, 500),
    init() {
      this.columnsWithItems = [];
      store.dispatch("LOAD_PEOPLES").then(
        response => {
          setTimeout(() => {
            if (response.data.results) {
              this.moreItems.push(...response.data.results);
              this.columns(response.data.results);
            }
            // console.log(response.data, store.getters.getPeoples.results);
          }, 300);
        },
        error => {
          console.log(error);
        }
      );
    },
    letterOfAvatar(name) {
      return name.charAt(0);
    },
    numberOfColumns() {
      if (window.innerWidth >= 767 && this.cols != 2) {
        this.cols = 2;
        this.init();
      } else if (window.innerWidth < 767 && this.cols != 1) {
        this.cols = 1;
        this.init();
      }
     // console.log(window.innerWidth);
    },
    colorOfAvatar(peoples) {
      function BinarySearch(requiredElement, Array) {
        let i = 0,
          j = Array.length,
          k;

        while (i < j) {
          k = Math.floor((i + j) / 2);
          if (requiredElement <= Array[k].name) j = k;
          else i = k + 1;
        }

        if (Array[i] && Array[i].name === requiredElement) return Array[i];
        else return -1;
      }

      this.post = this.post.concat(peoples);

      this.post = this.post
        .sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        })
        .reduce(function(arr, el) {
          if (!arr.length || arr[arr.length - 1].name != el.name) {
            arr.push(el);
          }
          return arr;
        }, []);

      peoples.filter(people => {
        // console.log(people.name, this.post);
        let search = BinarySearch(people.name, this.post);
        if (search != -1) {
          if (!search.colorId) {
            people.colorId = true;
            search.colorId = true;
            people.color =
              "#" +
              ("000" + ((Math.random() * (1 << 24)) | 0).toString(16)).substr(
                -6
              );
            search.color = people.color;
            this.post.push(people);
          } else {
            people.colorId = search.colorId;
            people.color = search.color;
          }
        }
        //console.log(this.post);
      });

      return peoples;
    },
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow && !this.searchName) {
          if (this.peoplesPagination && this.scrolledToBottom) {
            this.scrolledToBottom = false;
            this.isLoadingMore = true;
            store
              .dispatch("LOAD_PEOPLES_PAGINATION", {
                pagination: this.peoplesPagination.next
              })
              .then(
                () => {
                  setTimeout(() => {
                    if (store.getters.getPeoplesPagination.results) {
                      this.moreItems.push(
                        ...store.getters.getPeoplesPagination.results
                      );
                      this.columns(store.getters.getPeoplesPagination.results);
                    }
                    this.isLoadingMore = false;
                    this.scrolledToBottom = true;
                  }, 300);
                },
                error => {
                  console.log(error);
                  this.isLoadingMore = false;
                }
              );
          }
        }
      };
    },
    columns(newInfo) {
      if (newInfo) {
        if (this.searchName) {
          this.columnsWithItems = [];
        }
        let columns = [];
        console.log(this.cols, "columns");
        let cols = [];
        let mid = Math.ceil(newInfo.length / this.cols);
        for (let col = 0; col < this.cols; col++) {
          //console.log(cols)
          if (this.columnsWithItems.length > 0) {
            columns = this.columnsWithItems[col].concat(
              [...newInfo].slice(col * mid, col * mid + mid)
            );
          } else
            columns = this.columnsWithItems.concat(
              [...newInfo].slice(col * mid, col * mid + mid)
            );
          cols.push(this.colorOfAvatar(columns));

          // console.log( this.columnsWithItems)
        }

        //console.log(columns[0])
        return (this.columnsWithItems = cols);
      }
    },
    onclickCard(person) {
      store.state.closePopUp = false;
      store.state.person = person;
    }
  },
  mounted() {
    this.numberOfColumns();
    this.scroll();
  },
  created() {
    store
      .dispatch("LOAD_PEOPLES")
      .then(
        response => {
          setTimeout(() => {
            if (response.data.results) {
              this.moreItems.push(...response.data.results);
              this.columns(response.data.results);
            }
            //console.log(response.data, store.getters.getPeoples.results);
          }, 300);
        },
        error => {
          console.log(error);
        }
      )
      .then(
        setTimeout(() => {
          if (store.state.loading) store.state.showPreloader = false;
        }, 2000)
      );
    window.addEventListener("resize", this.numberOfColumns());
    this.numberOfColumns();
  },
  computed: {
    ...mapGetters({
      peoples: "getPeoples",
      peoplesPagination: "getPeoplesPagination"
    }),
    ...mapState(["searchQuery"]),
    ...mapState(["searchPeoples"]),
    searchName: {
      get() {
        return this.searchQuery;
      },
      set(val) {
        return this.setSearchQuery(val);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.numberOfColumns());
  }
};
</script>

<style lang="scss">
.cards {
  position: relative;
  background: #323232;
  min-height: calc(66vh - 120px);
  padding-top: 107px;

  &__search {
    margin: auto;
    width: 56vw;
    padding-bottom: 7.5px;
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  &__wrapper-cards {
    margin-top: 80px;
    margin-left: 7.8%;
    margin-right: 7.8%;
    padding-bottom: 160px;
  }
}

.search {
  border-bottom: 1px solid #808080 !important;
  position: relative;

  input {
    width: 100%;
    background: #323232;
    color: #808080 !important;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    border: none;
    outline: none !important;

    &:focus {
      outline: none;
      font-family: "Roboto", sans-serif;
      color: #fff !important;
    }
  }

  i {
    width: 23.32px;
    height: 23.32px;
    color: #808080;
  }

  &__label {
    position: absolute;
    pointer-events: none;
    left: 0px;
    bottom: 0px;
    color: #808080 !important;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    transition: 0.2s;

    input:focus ~ &,
    input:not(:focus):valid ~ & {
      top: -16px;
      font-size: 13px;
      line-height: 15px;
    }
  }
}

.wrapper-cards {
  display: flex;

  &__column {
    flex-grow: 1;
    flex-direction: column;
  }

  &__item-container {
    margin-right: 32px;
    width: 42vw;
    height: 320px;
    margin-bottom: 32px;
    background: #1a1a1a;
    border-radius: 8px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.4);
    flex-direction: column;
    animation-duration: 1s;
    animation-fill-mode: both;

    &:hover {
      box-shadow: 0px 10px 40px rgba(37, 136, 167, 0.38);
      cursor: pointer;
    }
  }

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;

    span {
      display: flex;
      align-items: center;
      text-align: center;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 500;
      font-size: 48px;
      line-height: 56px;
      font-feature-settings: "liga" off;
      color: #ffffff;
    }
  }

  &__name {
    font-family: "Roboto";
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    text-align: center;
    font-feature-settings: "liga" off;
    color: #ffffff;
  }

  &__species {
    font-family: "Roboto";
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    font-feature-settings: "liga" off;
    color: #808080;
    margin-top: 9px;
  }
}

@media (max-width: 767px) {
  .cards {
    padding-top: 45px;

    &__search {
      width: 85vw;
    }

    &__wrapper-cards {
      margin-top: 44px;
      margin-left: 7.5%;
      margin-right: 7.5%;
      padding-bottom: 120px;
    }
  }

  .search {
    input {
      font-size: 16px;
      line-height: 19px;
    }

    i {
      width: 18.68px;
      height: 18.68px;
      color: #808080;
    }

    &__label {
      font-size: 16px;
      line-height: 19px;

      input:focus ~ &,
      input:not(:focus):valid ~ & {
        top: -17px;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }

  .wrapper-cards {
    &__item-container {
      width: 85vw;
      height: 200px;
      margin-bottom: 24px;
    }

    &__species {
      font-size: 12px;
      line-height: 14px;
      margin-top: 8px;
    }
  }
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
</style>

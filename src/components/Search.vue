<template>
  <div class="container mt-5">
    <h1>Search</h1>
    <form @submit.prevent="handleSearch()">
      <div class="mb-4">
        <label for="" class="form-label">Search</label>
        <input type="text" v-model="this.search" class="form-control" />
      </div>
      <div class="form-check">
        <input
          type="radio"
          value="team"
          v-model="picked"
          class="form-check-input"
        />
        <label class="form-check-label">Team</label>
      </div>
      <div class="form-check">
        <input
          type="radio"
          value="player"
          v-model="picked"
          class="form-check-input"
        />
        <label class="form-check-label">Player</label>
      </div>
      <div v-if="errorTeam || errorPlayer" class="mt-2 mb-2">
        <p>{{ this.errorMessage }}</p>
      </div>
      <div v-if="this.errorSearch" class="mt-2 mb-2">
        <p>{{ this.errorMsg }}</p>
      </div>
      <button class="btn btn-primary">Search</button>
    </form>
    <div v-if="loadingTeam">Buscando...</div>
    <div v-if="this.resp" class="mt-5">
      <h2>Resultados</h2>
      <p>
        Total pages: {{ this.response.totalPages }}
        <br />
        Page: {{ this.response.page }}
        <br />
        Total Items: {{ this.response.items }}
        <br />
        Items: {{ this.response.totalItems }}
      </p>
      <div>
        <div v-if="this.players" class="d-flex">
          <h5>Ordenar</h5>
          <div class="pageClass d-flex ms-2" @click="handleSearchOrder()">
            <font-awesome-icon icon="fa-solid fa-arrow-down" />
            <font-awesome-icon icon="fa-solid fa-arrow-up" />
          </div>
        </div>
        <div class="row">
          <div
            class="col-sm-6"
            v-for="(item, index) in this.response.players"
            :key="index"
          >
            <div class="card cardPlayer mt-2">
              <div class="card-body">
                <h5 class="card-title btn btn-primary">{{ item.name }}</h5>
                <div>
                  <p class="card-text">Equipo: {{ item.club }}</p>
                  <p class="card-text">Posicion: {{ item.position }}</p>
                  <p class="card-text">Pais: {{ item.nation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <p class="me-1">Page</p>
        <p
          v-for="(item, index) in page"
          :key="index"
          @click="handleSearchPage(item)"
          class="pageClass me-2"
        >
          {{ item }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { Response } from "../interfaces/response";
import { TEAM, PLAYER } from "../apollo/queries";

export default defineComponent({
  name: "search-component",
  setup() {
    const {
      mutate: searchTeam,
      loading: loadingTeam,
      error: errorTeam,
    } = useMutation(TEAM);

    const {
      mutate: searchPlayer,
      loading: loadingPlayer,
      error: errorPlayer,
    } = useMutation(PLAYER);

    return {
      searchTeam,
      loadingTeam,
      errorTeam,
      searchPlayer,
      loadingPlayer,
      errorPlayer,
    };
  },
  data() {
    return {
      search: "",
      response: {} as Response,
      resp: false,
      picked: "",
      errorMessage: "No hay coincidencias",
      page: [] as string[],
      activePage: "",
      errorSearch: false,
      errorMsg: "Todos los campos son obligatorios",
      players: false,
      order: "asc",
    };
  },
  methods: {
    async handleSearch() {
      if (this.errorSearch) this.errorSearch = false;
      if (!this.search || !this.picked) {
        this.errorSearch = true;
        return;
      }
      if (this.resp) {
        this.resp = false;
        this.page = [];
      }
      this.validate(this.picked);
    },
    async validate(type: string) {
      if (type === "team") {
        if (this.players) this.players = false;
        const resp = await this.searchTeam({ input: { name: this.search } });
        if (!resp) return;
        if (!resp.data) return;
        this.resp = true;
        this.response = resp.data.searchTeam;
        const { totalPages, page } = this.response;
        this.pages(totalPages, page);
      } else {
        const resp = await this.searchPlayer({
          input: { search: this.search },
        });
        if (!resp) return;
        if (!resp.data) return;
        this.players = true;
        this.resp = true;
        this.response = resp.data.searchPlayer;
        const { totalPages, page } = this.response;
        this.pages(totalPages, page);
      }
    },
    async handleSearchPage(item: string) {
      this.activePage = item;
      if (this.picked === "team") {
        const page = parseInt(item);
        const resp = await this.searchTeam({
          input: { name: this.search, page },
        });
        if (!resp) return;
        if (!resp.data) return;
        this.response = resp.data.searchTeam;
      } else {
        const page = parseInt(item);
        const resp = await this.searchPlayer({
          input: { search: this.search, page },
        });
        if (!resp) return;
        if (!resp.data) return;
        this.response = resp.data.searchPlayer;
      }
    },
    pages(totalPages: number, page: number) {
      this.activePage = page.toString();
      if (totalPages === 1) {
        this.page[0] = totalPages.toString();
        return;
      }
      for (let index = 0; index < totalPages; index++) {
        const total = index + 1;
        this.page[index] = total.toString();
      }
    },
    async handleSearchOrder() {
      if (this.order === "asc") this.order = "desc";
      if (this.order === "desc") this.order = "asc";
      const page = parseInt(this.activePage);
      const resp = await this.searchPlayer({
        input: { search: this.search, page, order: this.order },
      });
      if (!resp) return;
      if (!resp.data) return;
      console.log(resp.data.searchPlayer);
      this.response = resp.data.searchPlayer;
    },
  },
});
</script>

<style>
.pageClass {
  cursor: pointer;
}
.cardPlayer {
  height: 250px;
}
</style>

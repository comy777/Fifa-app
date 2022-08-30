<template>
  <div class="container mt-5">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit()">
      <div>
        <div class="mb-2">
          <label for="" class="fomr-label">Email</label>
          <input type="email" v-model="this.user.email" class="form-control" />
        </div>
        <div class="mb-2">
          <label for="" class="fomr-label">Password</label>
          <input
            type="password"
            v-model="this.user.password"
            class="form-control"
          />
        </div>
      </div>
      <div v-if="loading">Cargando...</div>
      <button class="btn btn-primary float-end">Ingresar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { defineComponent } from "vue";
import { provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "../apollo/config";
import { User } from "../interfaces/components";

provideApolloClient(apolloClient);

export default defineComponent({
  name: "login-component",
  data() {
    return {
      user: { email: "", password: "" } as User,
    };
  },
  setup() {
    const {
      mutate: login,
      loading,
      error,
    } = useMutation(
      gql`
        mutation login($input: LoginInput) {
          login(input: $input) {
            token
          }
        }
      `
    );
    return {
      login,
      loading,
      error,
    };
  },
  methods: {
    async handleSubmit() {
      const resp = await this.login({
        input: this.user,
      });
      if (!resp) return;
      if (!resp.data) return;
      const token = resp.data.login.token;
      localStorage.setItem("token", token);
      this.$router.push("/home");
    },
  },
});
</script>

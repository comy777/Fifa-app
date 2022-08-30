// import { createApp } from 'vue'
// import App from './App.vue'
// createApp(App).mount('#app')

import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import "bootswatch/dist/lux/bootstrap.min.css";
import { apolloClient } from "./apollo/config";
import App from "./App.vue";
import router from "./router";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.use(router);
app.mount("#app");

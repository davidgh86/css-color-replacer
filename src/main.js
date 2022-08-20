import { createApp } from "vue";
import App from "./App.vue";

// import VueAxios from "vue-axios";
// import { axios } from "./services/client";

const app = createApp(App);

//app.config.compilerOptions.isCustomElement = (tag) => tag.includes("-");

app.mount("#app");

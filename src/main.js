import { createPinia } from 'pinia';
import { createApp } from 'vue';
import "./style.css";
import App from './App.vue';
import router from './router';
import VueKonva from 'vue-konva';

const Vue = createApp(App);

const pinia = createPinia();
Vue.use(pinia);
Vue.use(router);
Vue.use(VueKonva);

Vue.mount('#app');
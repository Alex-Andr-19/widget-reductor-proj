import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const Vue = createApp(App);

const pinia = createPinia();
Vue.use(pinia);
Vue.use(router);

Vue.mount('#app');
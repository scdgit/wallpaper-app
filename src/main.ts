import { createSSRApp } from "vue";
import 'virtual:svg-icons-register'
import SvgIcon from './components/SvgIcon.vue'

import App from "./App.vue";
export function createApp() {
  const app = createSSRApp(App);
  app.component('SvgIcon', SvgIcon)
  return {
    app,
  };
}

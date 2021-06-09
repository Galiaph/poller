import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const options = {
  transition: 'Vue-Toastification__fade',
  maxToasts: 20,
  newestOnTop: true,
  position: 'bottom-right',
  timeout: false,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: false,
  rtl: false,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter(
      t => (t.content === toast.content)
    ).length !== 0) {
      // Returning false discards the toast
      return false
    }
    // You can modify the toast if you want
    return toast
  }
}

const authInterceptor = (config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = 'Darsan2 ' + token
  }

  return config
}
const errorInterceptor = async error => {
  // check if it's a server error
  if (!error.response) {
    // notify.warn('Network/Server error');
    console.error('**Network/Server error')
    console.log(error.response)
    return Promise.reject(error)
  }

  const toast = useToast()

  // all the other error responses
  switch (error.response.status) {
    case 400:
      console.error(error.response.status, error.message)
      // notify.warn('Nothing to display', 'Data Not Found');
      break

    case 401: // authentication error, logout the user
      // notify.warn('Please login again', 'Session Expired');
      console.error(error.response.status, error.message)
      // router.push('/auth');
      break

    case 403:
      console.error(error.response.status, error.message)
      toast.error(error.response.data, { timeout: 3000, bodyClassName: ['custom-class-1'] })
      await store.dispatch('logout')
      router.push('/login')
      break
    //
    // default:
    //   console.error(error.response.status, error.message)
  }
  return Promise.reject(error)
}

axios.interceptors.request.use(authInterceptor)
axios.interceptors.response.use(undefined, errorInterceptor)

app.use(store).use(router).use(Toast, options).mount('#app')

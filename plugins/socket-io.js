import Vue from "vue"
import VueSocketIO from "vue-socket.io"

/* eslint-disable */

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:5000',
}))






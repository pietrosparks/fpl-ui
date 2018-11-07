export default ({ store, $axios }) => {
  $axios.onRequest(config => {
    if (store.state.user) {
      config.headers.common["sessionid"] = store.state.user.sessionid
      config.headers.common["pl_profile"] = store.state.user.pl_profile
      config.headers.common["csrftoken"] = store.state.user.csrftoken
    }
  })
}

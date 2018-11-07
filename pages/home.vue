<template>
  <div>
    <section class="container">
      <navbar/>
      <div class="row mt-5">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">{{ entry.name }}</h4>
              <hr>
              <h5 class="card-subtitle mb-2">{{ player.first_name }} {{ player.last_name }}</h5>
              <p class="card-text">GW {{ entry.current_event }} Points : {{ entry.summary_event_points }}</p>
              <p class="card-text">Total Points : {{ entry.summary_overall_points }}</p>
              <p class="card-text">Value : {{ entry.value }} Bank: {{ entry.bank }}</p>
              <p class="card-text">Country: {{ entry.player_region_name }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">

         
          <div class="card">
            <div class="list-group">
              <nuxt-link :to="'/groups/'+entry.id" class="list-group-item list-group-item-action">
                My groups
              </nuxt-link>
              <nuxt-link to="/myteam" class="list-group-item list-group-item-action">My Team</nuxt-link>
              <nuxt-link to="/wallet" class="list-group-item list-group-item-action">Wallet</nuxt-link>
              
             
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import Navbar from "~/components/shared/navbar"

export default {
  components: {
    Navbar
  },
  data() {
    return {
      user: {}
    }
  },
  async asyncData({ app }) {
    return app.$axios.$get("http://localhost:5000/fpl/user").then(resp => {
      console.log(app.$axios.defaults.headers.common, "resp")
      console.log(resp, "reeeeee")
      return {
        user: resp.data.body
      }
    })
  },
  computed: {
    player() {
      return this.user.player
    },
    entry() {
      return this.user.entry
    }
  },
  methods: {}
}
</script>

<template>
  <div>
    <div class="container">
      <navbar/>
      <h1 class="display-2">Groups</h1>
      <hr>
      <div v-for="league in leagues" :key="league.id" class="card" @click="openGroup(league.id)">
        <div class="card-body">
          <h5 class="card-title">{{ league.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Pos This GW: {{ league.entry_rank }} Pos Last GW:
            {{ league.entry_last_rank }} <span v-if="league.entry_movement === 'up'"><i class="fa fa-arrow-up"/>{{ league.entry_change }}</span>
          <span v-else><i class="fa fa-arrow-down"/></span>{{ league.entry_change }}</h6>
          <p class="card-text">League type : {{ league.league_type }}</p>
          
          <!--Should involve user info in state. Things that dont change [compare if same player id for admin]-->
          <span v-if="league.entry_can_admin" class="badge badge-pill badge-success">Admin</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/shared/navbar"

export default {
  name: "Groups",
  components: {
    Navbar
  },
  data() {
    return {}
  },
  async asyncData({ app, params }) {
    return app.$axios
      .get(`http://localhost:5000/fpl/user/groups/${params.id}`)
      .then(resp => {
        const { classic } = resp.data.data
        return {
          leagues: classic
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  methods: {
    openGroup(id) {
      this.$router.push(`/group/${id}`)
    }
  }
}
</script>
<style scoped>
</style>

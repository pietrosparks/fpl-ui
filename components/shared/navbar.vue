<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info">


      <b-navbar-brand href="#">NavBar</b-navbar-brand>

      <b-collapse id="nav_collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item href="/home">Home</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="logout()">Logout</b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "Navbar",
  data() {
    return {}
  },
  methods: {
    ...mapActions(["logout"])
  }
}
</script>

<style scoped>
</style>

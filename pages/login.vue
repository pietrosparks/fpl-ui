<template>
  <section class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-4 offset-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Login</h5>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input id="exampleInputEmail1" v-model="user.email" type="email" class="form-control" aria-describedby="emailHelp" placeholder="greys@gmail.com">
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input id="exampleInputPassword1" v-model="user.password" type="password" class="form-control" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary" @click="login">Submit</button>
          </div>
        </div>
      </div>
      <div class="col-md-4"/>
      
      <!-- <div class="column is-one-thirds">
        <div class="box">
          <p class="is-size-4">Login</p>
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="greys@gmail.com" v-model="user.email">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="password" placeholder="xxxxx" v-model="user.password">
            </div>
          </div>
          <a class="button is-default" @click="login">Login</a>
        </div>
      </div> -->
      <div class="column is-one-thirds"/>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      user: {}
    }
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.user)
    }
  }
}
</script>

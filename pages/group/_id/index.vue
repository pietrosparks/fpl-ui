<template>
  <div>
    <div class="container">
      <navbar/>
      <div class="row">
        <div class="col-md-6">
          <h1 class="display-2">{{ league.name }}</h1>
        </div>
        <div class="col-md-6">
          <b-button class="btn btn-info btn-lg mt-4 float-right" @click="modalShow = !modalShow">
            Register Group
          </b-button>
        </div>
      </div>
     
    

      <hr>
      <h1 class="display-6">Members</h1>
      <div>
        <span v-if="paymentActive" class="badge badge-pill badge-secondary">Active</span>
        <span v-else class="badge badge-pill badge-danger">Inactive</span>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Name</th>
            <th scope="col">GW ({{ currentGameweek.id }}) Points</th>
            <th scope="col">Total</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="member in standings.results" :key="member.id">
            <th scope="row">{{ member.rank }} </th>
            <td>{{ member.entry_name }} <span v-if="member.entry === league.admin_entry" class="badge badge-pill badge-success">A</span></td>
            <td>{{ member.event_total }}</td>
            <td>{{ member.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <b-modal v-if="step === 1" v-model="modalShow" :title="'Register '+ league.name + ' for automated payments'" centered @ok="registerGroup()">
      <div class="form-group"/>
      <div class="form-group">
        <label for="exampleInputPassword1">How much to be collected weekly per individual</label>
        <input id="exampleInputAmount2" v-model="group.collectionAmount" type="number" class="form-control" aria-describedby="enterAmount2" placeholder="Enter Individual Amount">
      </div>

      <div class="form-group">
        <label for="exampleInputPassword1">Number Of Winners</label>
        <select v-model="group.prizeShare" class="custom-select mb-3">
          <option disabled value="">Select</option>
          <option value="1">One (100%)</option>
          <option value="2">Two (70% 30%)</option>
          <option value="3">Three (50% 30% 20%)</option>
        </select>
      </div>
      <div class="form-group form-check">
        <input id="exampleCheck1" v-model="group.transferHit" type="checkbox" class="form-check-input">
        <label class="form-check-label" for="exampleCheck1">Deduct non-free Transfer points</label>
      </div>
      <div class="form-group form-check">
        <input id="exampleCheck2" v-model="group.finalPrize" type="checkbox" class="form-check-input">
        <label class="form-check-label" for="exampleCheck2">End Of Season Prize?</label>
      </div>
      <div v-if="group.finalPrize === true" class="form-group">
        <label for="finalDisbursement">How much to be disbursed at End Of Season</label>
        <input id="exampleInputAmount2" v-model="group.finalPrizeAmount" type="number" class="form-control" aria-describedby="enterAmount2" placeholder="Enter Amount">
      </div>

     
      <hr>
      <label for="exampleInputAmount1">Per Individual</label>
      <h3>{{ totalCollectionAmount/100/standings.results.length }} x {{ gameweeksLeft }} <small>(GW left)</small></h3>
      <label for="exampleInputAmount1">Total</label>
      <h3>{{ totalCollectionAmount/100 }}</h3>
  
    </b-modal >

    <div v-if="step === 2" class="row">
      <b-modal v-model="cardPayment" size="lg" centered>
        <vue-frame ref="parentFrame" :url="chargeUrl" :default="true" class="form-control text-center" text="Pay Fee for Group" frame="chargeFrame" type="div"/>
        <iframe id="chargeFrame" :url="chargeUrl" style="border-style: none;" width="100%" height="500"/>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/shared/navbar"
import VueFrame from "vue-frame"
import { mapGetters } from "vuex"

export default {
  name: "Group",
  components: {
    Navbar,
    VueFrame
  },
  data() {
    return {
      modalShow: false,
      cardPayment: false,
      chargeUrl: "",
      step: 1,
      group: {
        prizeShare: ""
      }
    }
  },
  async asyncData({ app, params }) {
    return app.$axios
      .get(`http://localhost:5000/fpl/user/group/${params.id}`)
      .then(resp => {
        console.log(resp, "resp")
        const { league, standings, groupData, events } = resp.data.data
        return {
          league,
          standings,
          groupData,
          events
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  computed: {
    ...mapGetters(["user"]),
    paymentActive() {
      return this.groupData === null ? false : true
    },
    currentGameweek() {
      return this.events.find(e => e.is_current === true)
    },
    finishedGameWeek() {
      return this.currentGameweek.finished
    },
    gameweeksLeft() {
      if (!this.currentGameweek) return this.events.length
      return this.events.length - this.currentGameweek.id
    },
    paystackFee() {
      const fee = (this.prePaystackFee * 1.5) / 100
      if (fee >= 2000) return 2000
      return fee
    },
    prePaystackFee() {
      const totalAmount =
        (Number(this.group.collectionAmount) || 0) *
          this.standings.results.length *
          this.gameweeksLeft +
        (Number(this.group.finalPrizeAmount) || 0)
      return totalAmount * 100
    },
    totalCollectionAmount() {
      const totalAmount =
        (Number(this.group.collectionAmount) || 0) *
          this.standings.results.length *
          this.gameweeksLeft +
        (Number(this.group.finalPrizeAmount) || 0) +
        (this.paystackFee || 0)
      return totalAmount * 100
    },
    formattedMembers() {
      const players = this.standings.results
      const formatted = players.map(p => {
        return {
          player_name: p.player_name,
          team_name: p.entry_name,
          team_id: p.entry,
          started: p.start_event
        }
      })
      return formatted
    }
  },
  methods: {
    openGroup(id) {
      this.$router.push(`/group/${id}`)
    },
    registerGroup() {
      this.group.groupId = this.$route.params.id
      this.group.name = this.league.name
      this.group.groupAdmin = this.league.admin_entry
      this.group.adminMail = this.user
      this.group.totalAmount = this.totalCollectionAmount
      this.group.members = this.formattedMembers
      this.group.started = this.currentGameweek.id

      this.$axios
        .post("http://localhost:5000/fpl/group/new", this.group)
        .then(resp => {
          const { authorization_url } = resp.data.data.data
          this.chargeUrl = authorization_url
          this.step++
          this.cardPayment = true
        })
        .catch(err => {
          console.log(err, "err")
        })
    }
  }
}
</script>
<style scoped>
</style>

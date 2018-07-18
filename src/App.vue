<template>
  <div>
    <v-app>
      <v-toolbar :color="headerColor">
        <transition name="slide-fade">
          <v-btn icon @click="goRoute" v-if="displayableBack">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </transition>
        <v-toolbar-title>ya smile</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          v-if="!displayableBack"
          @click.native="dialog = true">
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content v-if="onStart">
        <router-view></router-view>
      </v-content>
      <Login v-if="onLogin"/> 
      <Preinitiation v-if="onPreinitiation"/>
      <End v-if="onEnd"/>

      <v-dialog v-model="dialog" scrollable fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar color="white">
            <v-btn icon @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Credit Title</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text style="height: 100vh">
          <v-list subheader>
            <v-subheader>planner and supporter</v-subheader>
            <v-list-tile v-for="credit in credits.planner" :key="credit.name" avatar>
              <v-list-tile-avatar>
                <img :src="credit.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="credit.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-subheader>creator</v-subheader>
            <v-list-tile v-for="credit in credits.creator" :key="credit.name" avatar>
              <v-list-tile-avatar>
                <img :src="credit.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="credit.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-subheader>and...</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img src="img/avatar/you.jpg">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="getUser"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-app>
  </div>
</template>

<style scoped>
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }
  .slide-fade-enter { transform: translateX(10px); }
  .slide-fade-leave-to { transform: translateX(-10px); }
</style>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import Login from '@/components/Login'
  import Preinitiation from '@/components/Preinitiation.vue'
  import End from '@/components/End.vue'

  export default {
    components: {
      Login,
      Preinitiation,
      End,
    },
    data() {
      return {
        backRoute: {
          reading: "/",
          generate: "/",
          emotiondetection: "/reading",
        },
        headerColors: {
          start: 'white',
          reading: 'pink lighten-2',
          generate: 'light-blue lighten-3',
          emotiondetection: 'pink lighten-2',
        },
        isStarted: false,
        isEnded: false,
        dialog: false,
        credits: {
          creator: [
            {avatar: "img/avatar/tsukamotota.jpg", name: "Takashi Tsukamoto"},
            {avatar: "img/avatar/yamamotoya.jpg", name: "Yasutaka Yamamoto"},
            {avatar: "img/avatar/kubotak.jpg", name: "Kenjiro Kubota"},
            {avatar: "img/avatar/okashitay.jpg", name: "Yukio Okashita"},
            {avatar: "img/avatar/nishinek.jpg", name: "Keigo Nishine"},
          ],
          planner: [
            {avatar: "img/avatar/yamamotos.jpg", name: "Shoji ackey Yamamoto"},
            {avatar: "img/avatar/kusanoy.jpg", name: "Yu Kusano"},
            {avatar: "img/avatar/koyashikih.jpg", name: "Hitomi Koyashiki"},
            {avatar: "img/avatar/tanakad.jpg", name: "Daisuke Tanaka"},
          ]
        }
      }
    },
    created() {
      this.initGame();
      this.$store.subscribe((mutation, state) => {

        this.isStarted = (
          state.Game.startedAt !== undefined
          && state.Game.startedAt !== null
        );

        this.isEnded = (
          state.Game.finishedAt !== undefined
          && state.Game.finishedAt !== null
        );
      });
    },
    computed: {
      onLogin() {
        return this.User.name === "";
      },
      onStart() {
        return this.isStarted && !this.isEnded && this.User.name !== "";
      },
      onPreinitiation() {
        return !this.isStarted && !this.isEnded && this.User.name !== "";
      },
      onEnd() {
        return this.isStarted && this.isEnded && this.User.name !== "";
      },
      getUser() {
        return this.User.name !== "" ? this.User.name : "You";
      },
      ...mapState(['User']),
      ...mapGetters(['Game/currentGame']),
      displayableBack() {
        return (this.$route.name in this.backRoute);
      },
      headerColor() {
        return this.headerColors[this.$route.name];
      },
    },
    methods: {
      ...mapActions('Game', ['initGame']),
      goRoute($path = '/') {
        for (let name in this.backRoute) {
          if (this.$route.name === name) {
            $path = this.backRoute[name];
          }
        }
        this.$router.push($path);
      },
    },
  }
</script>

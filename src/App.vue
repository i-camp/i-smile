<template>
  <div>
    <v-app>
      <v-toolbar dark color="primary">
        <transition name="slide-fade">
          <v-btn icon @click="goToBack" v-if="displayableBack">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </transition>
        <v-toolbar-title>i-smile</v-toolbar-title>
      </v-toolbar>
      <v-content v-if="onStart">
        <router-view></router-view>
      </v-content>
      <Preinitiation v-if="onPreinitiation"/>
      <End v-if="onEnd"/>
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
  import { mapActions, mapGetters } from 'vuex'
  import Preinitiation from '@/components/Preinitiation.vue'
  import End from '@/components/End.vue'

  export default {
    components: {
      Preinitiation,
      End,
    },
    data() {
      return {
        backRoute: {
          reading: true,
          generate: true,
          emotiondetection: true,
        },
        isStarted: false,
        isEnded: false,
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
      onStart() {
        return this.isStarted && !this.isEnded;
      },
      onPreinitiation() {
        return !this.isStarted && !this.isEnded;
      },
      onEnd() {
        return this.isStarted && this.isEnded;
      },
      ...mapGetters(['Game/currentGame']),
      displayableBack() {
        return (this.$route.name in this.backRoute);
      },
    },
    methods: {
      ...mapActions('Game', ['initGame']),
      goToBack() {
        this.$router.back();
      },
    },
  }
</script>

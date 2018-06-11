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
      <v-content>
        <router-view></router-view>
      </v-content>
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
  export default {
    data() {
      return {
        backRoute: {
          reading: true,
          generate: true,
          emotiondetection: true,
        },
      }
    },
    computed: {
      displayableBack() {
        return (this.$route.name in this.backRoute);
      },
    },
    methods: {
      goToBack() {
        this.$router.back();
      }
    }
  }
</script>

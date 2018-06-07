<template>
  <div id="app">
    <v-app>
      <v-toolbar dark color="primary">
        <v-btn icon @click="goToBack" v-if="displayableBack">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>i smile</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

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

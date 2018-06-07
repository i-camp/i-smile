<template>
  <v-layout row justify-center>
    <v-btn color="primary" dark @click="goToReading">撮るマン</v-btn>
    <v-btn color="primary" dark @click="goToGenerate">撮られるマン</v-btn>
  </v-layout>
</template>

<script>
  export default {
     data () {
      return {
        dialog: false,
      }
    },
    methods: {
      goToReading() {
        this.$router.push('reading')
      },
      goToGenerate() {
        this.$router.push('generate')
      },
    },
  }
</script>
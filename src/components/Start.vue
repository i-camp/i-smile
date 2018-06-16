<template>
  <v-container grid-list-md text-xs-center fluid fill-height>
    <v-layout row wrap align-center justify-center>
      
      <v-flex xs6 @click="goToReading" v-bind:class="{ reading: reading }">
        <v-card>
          <v-card-media
            src="/img/take_picture.jpg"
            height="50vh">
          </v-card-media>
          <v-card-title>
            <div>
              <span class="headline grey--text">Take a Pictre</span>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 @click="goToGenerate" v-bind:class="{ generate: generate }">
        <v-card>
          <v-card-media
            src="/img/to_be_smile.jpg"
            height="50vh">     
          </v-card-media>
          <v-card-title>
            <div>
              <span class="headline grey--text">To be Smile</span>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<style scoped>
.reading, .generate {
  animation: down 100ms ease 0ms 1 normal none running;
}
@keyframes down {
  0% {
    margin-top: 0px;
  }
  50% {
    margin-top: 10px;
  }
  100% {
    margin-top: 0px;
  }
}
</style>


<script>
  export default {
     data () {
      return {
        reading: false,
        generate: false,
      }
    },
    methods: {
      goToReading() {
        this.reading = true;
        setTimeout(() => {
          this.$router.push('reading');
        }, 100);
      },
      goToGenerate() {
        this.generate = true;
        setTimeout(() => {
          this.$router.push('generate');
        }, 100);
      },
    },
  }
</script>
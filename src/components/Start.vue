<template>
  <v-container class="start--container" grid-list-md text-xs-center fluid fill-height>
    <v-layout row wrap align-center justify-center>
      
      <v-flex xs6 @click="goToGenerate" v-bind:class="{ generate: generate }">
        <v-card
          class="tile generate"
          color="light-blue lighten-3">
          <svg class="tile-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
          <g>
            <path d="M382.055,376.374l-2.594-33.586c-2.336-12.75-10.727-23.57-22.5-28.977l-50.68-20.718
              c-8.453-3.883-11.953-15.18-11.953-24.961v-7.852c0-3.726,0.594-7.414,1.828-10.938c0,0,33.562-29.562,33.562-70.851
              c0-51.602-33-84.782-73.726-84.782c-40.696,0-73.711,33.18-73.711,84.782c0,41.289,33.578,70.851,33.578,70.851
              c1.202,3.524,1.82,7.211,1.82,10.938v7.852c0,9.781-3.516,21.078-11.961,24.961l-50.695,20.718
              c-11.758,5.406-20.157,16.227-22.477,28.977l-2.61,33.586h126.055H382.055z"></path>
            <path d="M40,0v512h432V0H40z M424,416H88V48h336V416z"></path>
          </g>
          </svg>
        </v-card>
      </v-flex>

      <v-flex xs6 @click="goToReading" v-bind:class="{ reading: reading }">
        <v-card
          class="tile reading"
          color="pink lighten-2">
          <svg class="tile-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 512 512" xml:space="preserve">
            <g>
              <path d="M256,224.828c-34.344,0-62.156,28.078-62.156,62.719s27.813,62.719,62.156,62.719s62.156-28.078,62.156-62.719
                S290.344,224.828,256,224.828z"></path>
              <path d="M478.766,135.75h-58.625c-13.078,0-24.938-7.75-30.297-19.781l-17.547-39.313
                c-5.359-12.016-17.234-19.766-30.313-19.766H170.016c-13.078,0-24.953,7.75-30.328,19.766l-17.531,39.313
                C116.797,128,104.938,135.75,91.859,135.75H33.234C14.875,135.75,0,150.766,0,169.266v252.328c0,18.5,14.875,33.516,33.234,33.516
                h244.25h201.281c18.344,0,33.234-15.016,33.234-33.516V169.266C512,150.766,497.109,135.75,478.766,135.75z M256,403.844
                c-63.688,0-115.297-52.063-115.297-116.297S192.313,171.234,256,171.234s115.297,52.078,115.297,116.313
                S319.688,403.844,256,403.844z"></path>
            </g>
          </svg>
        </v-card>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

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

<style scoped>
.start--container {
  background: url("/img/yasmile_03.jpg") no-repeat center;
  background-size: cover;
}
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
.container.grid-list-md .layout .flex {
  padding: 10px;
}
.tile {
  height: 45vw!important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tile-svg {
  width: 30vw;
  height: 30vw;
  display: block;
  fill: #FFFFFF;
}
</style>
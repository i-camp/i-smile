<template>
  <div id="qrGenarate">
  <p>Generate QR code</p>
  <vue-q-art :config=config></vue-q-art>
  {{ config.value = `https://techblog.istyle.co.jp/` }}
  </div>
</template>

<script>
  import VueQArt from 'vue-qart'
  import { mapState } from 'vuex'

  export default {
  components: {
    VueQArt
  },
  name: "qrGenarate",
  data() {
    return {
      config: {
        value: "",
        imagePath: "/img/istyle.jpg",
        filter: "color"
      }
    };
  },
  computed: {
    ...mapState('User', {
      uuid: state => state.uuid,
    })
  },
};
</script>

<style>
#qrGenarate {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


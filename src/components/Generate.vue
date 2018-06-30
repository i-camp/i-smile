<template>
  <div id="qrGenarate">
  <p>Generate QR code</p>
  <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
  {{ value = `https://example` }}
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  import { mapState } from 'vuex'

  export default {
  components: {
    QrcodeVue
  },
  name: "qrGenarate",
  data() {
    return {
      value: '',
      size: 300
    }
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


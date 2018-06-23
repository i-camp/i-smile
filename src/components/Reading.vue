<template>
  <div class="qrReader">
    <qrcode-reader :paused="paused" @init="onInit" @decode="onDecode"></qrcode-reader>
  </div>
</template>

<script>
  import { QrcodeReader } from 'vue-qrcode-reader'

  export default {
    components: { QrcodeReader },
    name: "qrReader",
    data () {
      return {
        paused: false
      }
    },
    methods: {
      async onInit (promise) {
        // show loading indicator
        try {
          await promise
          // successfully initialized
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            // user denied camera access permisson
            alert(error);
          } else if (error.name === 'NotFoundError') {
            // no suitable camera device installed
            alert(error);
          } else if (error.name === 'NotSupportedError') {
            // page is not served over HTTPS (or localhost)
            alert(error);
          } else if (error.name === 'NotReadableError') {
            // maybe camera is already in use
            alert(error);
          } else if (error.name === 'OverconstrainedError') {
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
            alert(error);
          } else {
            // browser is probably lacking features (WebRTC, Canvas)
            alert(error);
          }
        } finally {
          // hide loading indicator
        }
      },
      onDecode(content){
        this.paused = true
        this.$router.push(content)
      }
    }
  }
</script>



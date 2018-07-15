<template>
  <div class="video-wrapper">
    <div class="scan-area">
      <div class="scan-image"></div>
    </div>
    <canvas width="640" height="640" class="video" ref="videoCanvas"></canvas>
    <QrcodeReader
      ref="qr"
      :paused="paused"
      @init="onInit"
      @decode="onDecode"
    />
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 class="video-bottom">
        <p class="display-1">Reading...</p>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Attention</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="backTop">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { QrcodeReader } from 'vue-qrcode-reader'
  import { mapActions, mapState } from 'vuex'
  import videoHelper from '@/components/utils/videoHelper'

  export default {
    mixins: [ videoHelper ],
    components: { QrcodeReader },
    name: "qrReader",
    data () {
      return {
        cancelId: null,
        paused: false,
        dialog: false,
        vid: null,
        videoCC: null,
        vw: 0,
        vh: 0,
        vx: 0,
        vy: 0,
        message: ''
      }
    },
    computed: {
      ...mapState('User', {
        uuid: state => state.uuid,
      })
    },
    mounted() {
      this.$refs.qr.$refs.canvas.remove()
      this.$refs.qr.$el.children.item(1).remove()
      this.videoCC = this.$refs.videoCanvas.getContext('2d')
      this.onInit().then(() => {
        this.vid = this.$refs.qr.$refs.video
        
        this.vid.addEventListener('canplay', () => {
          this.videoClip()
          this.drawLoop()
        })
      })
    },
    methods: {
      ...mapActions('Shots', ['hasShot']),
      backTop() {
        this.$router.push('/')
      },
      drawLoop() {
        this.videoCC.drawImage(this.vid, this.vx, this.vy, this.vw, this.vh);
        this.cancelId = window.requestAnimationFrame(this.drawLoop);
      },
      async onInit(promise) {
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
        this.paused = true;
        if (this.uuid === content) {
          this.message = "Your QR-Code.";
          this.dialog = true;
          return;
        } 
        this.hasShot(content).then(() => {
          this.$router.push('emotion/' + content);
        }).catch(() => {
          this.message = "Already has shot photo.";
          this.dialog = true;
        });
      },

      deleteCamera() {
        return new Promise(resolve => {
          if (this.vid.srcObject) {
            this.vid.srcObject.getVideoTracks().forEach(devise => {
              devise.stop();
            });
            this.vid.srcObject = null;
            resolve();
          }
        });   
      },
    },
    beforeDestroy() {
      this.deleteCamera();
      if (this.cancelId !== null) window.cancelAnimationFrame(this.cancelId)
    },
  }
</script>

<style>
.qrcode-reader__camera,
.qrcode-reader__overlay {
  display: none;
}
.video-wrapper {
  width: 100vw;
  height: auto;
}
.scan-area {
  position: absolute;
  z-index: 1;
  top: auto;
  left: auto;
  bottom: auto;
  right: auto;
  width: 100vw;
  height: 100vw;
  padding: 40px;
}
.video {
  width: 100vw;
  height: auto;
  top: auto;
  left: auto;
  bottom: auto;
  right: auto;
}
.scan-image {
  width: 100%;
  height: 100%;
  background: url('/img/frame.png') no-repeat center;
  background-size: cover;
}
.video-bottom {
  color: #716658;
  text-align: center;
  padding-top: 50px;
}
</style>
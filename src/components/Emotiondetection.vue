<template>
  <div class="emotiondetection">
    <div class="video-wrapper">
      <canvas width="640" height="640" class="overlay" ref="overlay" v-show="!shoted"></canvas>
      <canvas width="640" height="640" class="video" ref="video"></canvas>
      <video width="640" height="640" class="videoel" ref="videoel" preload="auto" loop playsinline autoplay></video>
    </div>
    <v-btn
      v-if="!shoted"
      fab
      dark
      color="light-blue lighten-3"
      class="button--switch"
      @click="switchCamera">
      <v-icon dark>camera_front</v-icon>
    </v-btn>

    <v-container grid-list-md class="video--bottom">
      <v-layout row wrap justify-center>
        <v-flex xs10>

          <div v-if="!shoted">
            <p class="headline text-xs-center">Say cheese!</p>
            <v-progress-linear
              background-color="pink lighten-4"
              color="pink lighten-2"
              height="30"
              v-model="smileVoltage"
            ></v-progress-linear>
          </div>

          <div v-if="shoted">
            <Upload :video="video"/>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import * as clmtrackr from 'clmtrackr'
  import Upload from '@/components/Upload.vue'
  import emotionClassifier from '@/components/utils/emotionClassifier'
  import videoHelper from '@/components/utils/videoHelper'
  import pModel from '@/components/models/model_pca_20_svm'
  import emotionModel from '@/components/models/emotion'

  const clm = clmtrackr.default;
  const THRESHOLD      = 70; // 笑顔シャッターの閾値
  const THRESHOLD_TIME = 500; // 笑顔判定の閾値持続時間
  
  export default {
    components: {
      Upload
    },
    mixins: [
      videoHelper,
    ],
    data() {
      return {
        cancelId: null,
        vid: null,
        vw: 0,
        vh: 0,
        vx: 0,
        vy: 0,
        overlay: null,
        overlayCC: null,
        video: null,
        videoCC: null,
        ctrack: null,
        trackingStarted: false,
        ec: null,
        emotionData: null,
        emotionParam: [
          {emotion: "happy", value: 0},
        ],
        currentCamera: "environment",
        videoSources: [],
        shoted: false,
        thresholdCount: 0,
        smileVoltage: 0,
      }
    },
    mounted() {
      this.vid       = this.$refs.videoel;
      this.vw        = this.vid.width;
      this.vh        = this.vid.height;
      this.overlay   = this.$refs.overlay;
      this.overlayCC = this.overlay.getContext('2d');
      this.video     = this.$refs.video;
      this.videoCC   = this.video.getContext('2d');
      
      pModel.shapeModel.nonRegularizedVectors.push(9);
      pModel.shapeModel.nonRegularizedVectors.push(11);

      this.ctrack = new clm.tracker({useWebGL : true});
      this.ctrack.init(pModel);

      this.ec = new emotionClassifier(emotionModel);
      this.emotionData = this.ec.getBlank();

      this.vid.addEventListener('canplay', this.startVideo, false);

      this.setCamera().then(() => {
        this.init();
      });
    },
    methods: {
      init() {
        let param = {video: {
            width: { min: 360, ideal: 640, max: 1920 },
            height: { min: 240, ideal: 480, max: 1080 },
            facingMode: { ideal: this.currentCamera },
          }
        };
        // check for camerasupport
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia(param).then(this.gumSuccess).catch(this.gumFail);
				} else if (navigator.getUserMedia) {
					navigator.getUserMedia(param, this.gumSuccess, this.gumFail);
				} else {
					alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
        }
      },

      startVideo() {
        this.vid.play();
        this.videoClip();
        this.ctrack.start(this.vid);
        this.trackingStarted = true;
        this.drawLoop();
      },

      drawLoop() {
        this.videoCC.drawImage(this.vid, this.vx, this.vy, this.vw, this.vh);

        this.cancelId = window.requestAnimationFrame(this.drawLoop);

        this.overlayCC.clearRect(0, 0, this.vw, this.vh);
        if (this.ctrack.getCurrentPosition()) {
          this.ctrack.draw(this.overlay);
        }
        let cp = this.ctrack.getCurrentParameters();
        let er = this.ec.meanPredict(cp);
        if (er) {
          this.emotionParam = er;
        }
      },

      gumSuccess(stream) {
        // add camera stream if getUserMedia succeeded
        if (this.vid.srcObject !== undefined) {
          this.vid.srcObject = stream
        } else if (this.vid.mozSrcObject !== undefined) {
          this.vid.mozSrcObject = stream
        } else if (window.URL.createObjectURL) {
          this.vid.src = window.URL.createObjectURL(stream)
        } else if (window.webkitURL) {
          this.vid.src = window.webkitURL.createObjectURL(stream)
        } else {
          this.vid.src = stream
        }
        if ("srcObject" in this.vid) {
          this.vid.srcObject = stream;
        } else {
          this.vid.src = (window.URL && window.URL.createObjectURL(stream));
        }
        this.vid.onloadedmetadata = () => {
          this.vid.play();
        }
        this.vid.onresize = () => {
          if (this.trackingStarted) {
            this.ctrack.stop();
            this.ctrack.reset();
            this.ctrack.start(this.vid);
          }
        }
      },

      gumFail() {
        alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
      },

      setCamera() {
        return navigator.mediaDevices.enumerateDevices().then(sourcesInfo => {
          // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
          sourcesInfo.forEach(device => {
            if (device.kind === 'videoinput') {
              this.videoSources.push(device);
            }
          });
        });
      },

      switchCamera() {
        if (this.videoSources.length > 1 && this.currentCamera === "environment") {
          this.currentCamera = "user";
        } else {
          this.currentCamera = "environment";
        }
        this.deleteCamera().then(this.init);
      },

      deleteCamera() {
        return new Promise(resolve => {
          if (this.vid.srcObject) {
            this.vid.srcObject.getVideoTracks().forEach(device => {
              device.stop();
            });
            this.vid.srcObject = null;
          }
          resolve(true);
        });   
      },

      thresholdShot(val) {
        if (this.thresholdCount <= 0 || val < THRESHOLD) {
          // 計測開始
          let dt = new Date();
          dt.setMilliseconds(dt.getMilliseconds() + THRESHOLD_TIME);
          this.thresholdCount = dt.getTime();
        }
        // THRESHOLD_TIMEms経過していたらtrue
        return this.thresholdCount <= new Date().getTime();
      },

      snapshot() {
        this.deleteCamera().then(() => {
          this.shoted = true;
        });
      }

    },
    beforeDestroy() {
      this.deleteCamera().then(() => {
        if (this.cancelId !== null) window.cancelAnimationFrame(this.cancelId)
      });
    },
    watch: {
      emotionParam(val) {
        let emotionParam  = Math.floor(val[0].value * 100);
        this.smileVoltage = Math.floor((emotionParam / THRESHOLD) * 100);
        if (
          !this.shoted
          && this.thresholdShot(emotionParam)
        ) {
          this.snapshot();
        }
      }
    }
  }
</script>

<style lang="scss">
.emotiondetection {
  .video-wrapper {
    width: 100vw;
    height: auto;
  }
  .videoel {
    display: none;
  }
  .overlay, .video {
    width: 100vw;
    height: auto;
    top: auto;
    left: auto;
    bottom: auto;
    right: auto;
  }
  .video {
    z-index: 1;
  }
  .overlay {
    z-index: 2;
  }
  .button--switch {
    position: absolute;
    margin: -35px 35px 0 0;
    right: 0;
  }
  .video--bottom {
    padding-top: 50px;
  }
}
</style>

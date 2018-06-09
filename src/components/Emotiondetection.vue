<template>
  <div class="container">
    <button @click="switchCamera">switch camea</button>
    <div class="video-wrapper">
      <video width="300" height="300" class="videoel" ref="videoel" preload="auto" loop playsinline autoplay></video>
      <canvas width="300" height="300" class="overlay" ref="overlay"></canvas>
    </div>
    <p>{{ emotionParam[0].emotion }}</p>
    <p>{{ emotionParam[0].value }}</p>
  </div>
</template>

<style>
.video-wrapper {
  width: 300px;
  height: 300px;
  overflow: hidden;
  display: block;
  position: relative;
}
.videoel, .overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.videoel {
  z-index: 1;
  min-width: 100vw;
  min-height: 100vh;
}
.overlay {
  z-index: 2;
}
</style>

<script>
  import * as clmtrackr from 'clmtrackr'
  import emotionClassifier from '@/components/utils/emotionClassifier';
  import videoHelper from '@/components/utils/videoHelper'
  import pModel from '@/components/models/model_pca_20_svm'
  import emotionModel from '@/components/models/emotion';

  const clm = clmtrackr.default;

  export default {
    mixins: [
      videoHelper,
    ],
    data() {
      return {
        vid: null,
        vw: 0,
        vh: 0,
        overlay: null,
        overlayCC: null,
        ctrack: null,
        trackingStarted: false,
        ec: null,
        emotionData: null,
        emotionParam: [
          {emotion: "happy", value: 0},
        ],
        currentCamera: 0,
        videoSrouces: [],
      }
    },
    mounted() {
      this.vid       = this.$refs.videoel;
      this.vw        = this.vid.width;
      this.vh        = this.vid.height;
      this.overlay   = this.$refs.overlay;
      this.overlayCC = this.overlay.getContext('2d');
      
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
      
      pModel.shapeModel.nonRegularizedVectors.push(9);
      pModel.shapeModel.nonRegularizedVectors.push(11);

      this.ctrack = new clm.tracker({useWebGL : true});
      this.ctrack.init(pModel);

      this.ec = new emotionClassifier(emotionModel);
      this.emotionData = this.ec.getBlank();

      this.vid.addEventListener('canplay', this.startVideo, false);

      this.setCamera().then(() => {
        this.defaultCamera();
        this.init();
      });
    },
    methods: {
      init() {
        let param = {video: {
            mandatory: {
              minWidth: "960",
              minHeight: "720"
            },
            optional: [
              {sourceId: this.videoSrouces[this.currentCamera].deviceId}
            ]
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
        this.ctrack.start(this.vid);
        this.trackingStarted = true;
        this.drawLoop();
      },

      drawLoop() {
        window.requestAnimFrame(this.drawLoop);
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

      adjustVideoProportions() {
        // resize overlay and video if proportions are different
        // keep same height, just change width
        let proportion = this.vid.videoWidth/this.vid.videoHeight;
        this.vw = Math.round(this.vh * proportion);
        this.vid.width = this.vw;
        this.overlay.width = this.vw;
      },

      setCamera() {
        return navigator.mediaDevices.enumerateDevices().then(sourcesInfo => {
          // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
          this.videoSrouces = sourcesInfo.filter(elem => {
              return elem.kind === 'videoinput';
          });
        });
      },

      gumSuccess(stream) {
        // add camera stream if getUserMedia succeeded
        if ("srcObject" in this.vid) {
          this.vid.srcObject = stream;
        } else {
          this.vid.src = (window.URL && window.URL.createObjectURL(stream));
        }
        this.vid.onloadedmetadata = () => {
          this.adjustVideoProportions();
          this.vid.play();
        }
        this.vid.onresize = () => {
          this.adjustVideoProportions();
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

      switchCamera() {
        this.defaultCamera();
        this.deleteCamera().then(this.init);
      },

      defaultCamera() {
        this.currentCamera++;
        if (this.currentCamera >= this.videoSrouces.length) {
          this.currentCamera = 0;
        }
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
    },
    watch: {
      emotionParam(val) {
        val.forEach(emotion => {
          if (emotion.emotion === 'happy' && (Math.floor(emotion.value * 10) >= 9)) {
            console.log(`笑顔`);
          }
        }); 
      }
    }
  }
</script>
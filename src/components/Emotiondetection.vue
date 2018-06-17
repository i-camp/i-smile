<template>
  <div>
    <div class="video-wrapper">
      <canvas width="640" height="640" class="overlay" ref="overlay" v-show="!shoted"></canvas>
      <canvas width="640" height="640" class="video" ref="video"></canvas>
      <video width="640" height="640" class="videoel" ref="videoel" preload="auto" loop playsinline autoplay></video>
    </div>
    <button @click="switchCamera">switch camea</button>
    <p>{{ emotionParam[0].emotion }}</p>
    <p>{{ percent(emotionParam[0].value) }}</p>
  </div>
</template>

<style>
.video-wrapper {
  width: 100vw;
  height: auto;
}
.videoel {
  display: none;
}
.overlay, .video {
  position: abusolute;
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
</style>

<script>
  import * as clmtrackr from 'clmtrackr'
  import emotionClassifier from '@/components/utils/emotionClassifier'
  import videoHelper from '@/components/utils/videoHelper'
  import saveSnap from '@/components/utils/saveSnap'
  import pModel from '@/components/models/model_pca_20_svm'
  import emotionModel from '@/components/models/emotion'
  import firebaseApp from '@/utils/firebase'
  import * as uuidv4 from 'uuid/v4'

  const clm = clmtrackr.default;
  const TRIM_SIZE = 640;
  const THRESHOLD = 80; // 笑顔シャッターの閾値

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

  export default {
    mixins: [
      videoHelper,
      saveSnap,
    ],
    data() {
      return {
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
        currentCamera: 0,
        videoSrouces: [],
        shoted: false,
        thresholdCount: 0,
        progress: 0,
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
        this.defaultCamera();
        this.init();
      });
    },
    methods: {
      init() {
        let param = {video: {
            mandatory: {
              minWidth: "640",
              minHeight: "480"
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
        this.videoClip();
        this.ctrack.start(this.vid);
        this.trackingStarted = true;
        this.drawLoop();
      },

      drawLoop() {
        this.videoCC.drawImage(this.vid, this.vx, this.vy, this.vw, this.vh);

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

      videoClip() {
        if (this.vid.videoWidth > this.vid.videoHeight) {
          this.vh = TRIM_SIZE;
          this.vw = this.vid.videoWidth * (TRIM_SIZE / this.vid.videoHeight);
          this.vx = -(this.vw - TRIM_SIZE) / 2;
          this.vy = 0;
        } else {
          this.vw = TRIM_SIZE;
          this.vh = this.vid.videoHeight * (TRIM_SIZE / this.vid.videoWidth);
          this.vx = -(this.vh - TRIM_SIZE) / 2;
          this.vx = 0;
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

      percent(val) {
        return Math.floor(val * 100);
      },

      thresholdShot(val) {
        if (this.thresholdCount <= 0 && this.percent(val) < THRESHOLD) {
          // 計測開始
          let dt = new Date();
          dt.setMilliseconds(dt.getMilliseconds() + 1000);
          this.thresholdCount = dt;
        }
        // 1000ms経過していたらtrue
        return (new Date(this.thresholdCount).getTime() <= new Date().getTime());
      },

      snapshot() {
        if ('vibrate' in navigator) navigator.vibrate(100);

        this.shoted = true;
        this.deleteCamera();

        let imagePath  = `photos/${uuidv4()}.jpg`;
        let storageRef = firebaseApp
          .storage()
          .ref()
          .child(imagePath);
        let uploadTask = storageRef.putString(this.video.toDataURL('image/jpg'), 'data_url');
        uploadTask.on('state_changed', snapshot => {
          this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        });

        uploadTask.then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.sendSnapEvent(this.$route.params.uuid, imagePath, downloadURL).then(() => {
              this.$router.push('/');
            });
          });
        });
      }

    },
    beforeDestroy() {
      this.deleteCamera();
    },
    watch: {
      emotionParam(val) {
        val.forEach(emotion => {
          if (
            emotion.emotion === 'happy'
            && !this.shoted
            && this.thresholdShot(emotion.value)
          ) {
            this.snapshot();
          }
        }); 
      }
    }
  }
</script>
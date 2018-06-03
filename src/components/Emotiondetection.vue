<template>
  <div class="container">
    <!-- <button @click="switchCamera">switch camea</button> -->
    <video width="400" height="400" class="videoel" ref="videoel" preload="auto" loop playsinline autoplay></video>
    <canvas width="400" height="400" class="overlay" ref="overlay"></canvas>
    <div ref='emotion_chart'></div>
    <p>{{ emotionParam[0].emotion }}</p>
    <p>{{ emotionParam[0].value }}</p>
  </div>
</template>

<style>
.container {
  position: relative;
}
.videoel, .overlay{
  /* height: 100%;
  height: 100vh;
  width: 100%;
  width: 100vw; */
  display: block;
}
.overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  -o-transform : scaleX(-1);
  -webkit-transform : scaleX(-1);
  transform : scaleX(-1);
  -ms-filter : fliph; /*IE*/
  filter : fliph; /*IE*/
  
}
.videoel {
  -o-transform : scaleX(-1);
  -webkit-transform : scaleX(-1);
  transform : scaleX(-1);
  -ms-filter : fliph; /*IE*/
  filter : fliph; /*IE*/
}
</style>

<script>
  import * as clmtrackr from 'clmtrackr'
  import * as d3 from 'd3'
  import {scaleLinear} from "d3-scale"
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
        ww: 0,
        wh: 0,
        vid: null,
        vw: 0,
        vh: 0,
        overlay: null,
        overlayCC: null,
        ctrack: null,
        trackingStarted: false,
        margin: {top : 20, right : 20, bottom : 10, left : 40},
        x: null,
        y: null,
        width: null,
        height: null,
        svg: null,
        ec: null,
        emotionData: null,
        emotionParam: [
          {emotion: "happy", value: 0},
        ],
      }
    },
    created() {
      this.ww = window.innerWidth;
      this.wh = window.innerHeight;
    },
    mounted() {
      this.vid       = this.$refs.videoel;
      this.vw        = this.vid.width;
      this.vh        = this.vid.height;
      this.overlay   = this.$refs.overlay;
      this.overlayCC = this.overlay.getContext('2d');
      this.init();
    },
    methods: {
      init() {
        // TODO
        // MediaStreamTrack.getSources(data => {console.log(data)});
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
				// check for camerasupport
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia({video : true}).then(this.gumSuccess).catch(this.gumFail);
				} else if (navigator.getUserMedia) {
					navigator.getUserMedia({video : true}, this.gumSuccess, this.gumFail);
				} else {
					alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
        }
        
        pModel.shapeModel.nonRegularizedVectors.push(9);
        pModel.shapeModel.nonRegularizedVectors.push(11);
        
        this.ctrack = new clm.tracker({useWebGL : true});
        this.ctrack.init(pModel);

        this.ec = new emotionClassifier(emotionModel);
        this.emotionData = this.ec.getBlank();
        this.initD3();

        this.vid.addEventListener('canplay', this.startVideo, false);
      },
      initD3() {
        this.width = 400 - this.margin.left - this.margin.right;
        this.height = 100 - this.margin.top - this.margin.bottom;
        let barWidth = 30;
        this.x = scaleLinear()
          .domain([0, this.ec.getEmotions().length]).range([this.margin.left, this.width + this.margin.left]);
        this.y = scaleLinear()
          .domain([0,1]).range([0, this.height]);
        this.svg = d3.select(this.$refs.emotion_chart).append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
        this.svg.selectAll("rect").
          data(this.emotionData).
          enter().
          append("svg:rect").
          attr("x", (datum, index) => { return this.x(index); }).
          attr("y", datum => { return this.height - this.y(datum.value); }).
          attr("height", datum => { return this.y(datum.value); }).
          attr("width", barWidth).
          attr("fill", "#2d578b");
        this.svg.selectAll("text.labels").
          data(this.emotionData).
          enter().
          append("svg:text").
          attr("x", (datum, index) => { return this.x(index) + barWidth; }).
          attr("y", datum => { return this.height - this.y(datum.value); }).
          attr("dx", -barWidth/2).
          attr("dy", "1.2em").
          attr("text-anchor", "middle").
          text(datum => { return datum.value;}).
          attr("fill", "white").
          attr("class", "labels");
        this.svg.selectAll("text.yAxis").
          data(this.emotionData).
          enter().append("svg:text").
          attr("x", (datum, index) => { return this.x(index) + barWidth; }).
          attr("y", this.height).
          attr("dx", barWidth/2).
          attr("text-anchor", "middle").
          attr("style", "font-size: 12").
          text(datum => { return datum.emotion;}).
          attr("transform", "translate(0, 18)").
          attr("class", "yAxis");
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
          this.updateData(er);
        }
      },
      // TODO
      setCamera() {
        // MediaStreamTrack.getSources(data => {});
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
      adjustVideoProportions() {
        // resize overlay and video if proportions are different
        // keep same height, just change width
        let proportion = this.vid.videoWidth / this.vid.videoHeight;
        this.vw = Math.round(this.vw * proportion);
        // this.vid.width = this.vw;
        // this.overlay.width = this.vw;
      },
      gumFail() {
        alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
      },
      updateData(data) {
        // update
        let rects = this.svg.selectAll("rect")
          .data(data)
          .attr("y", datum => {
            return this.height - this.y(datum.value);
          })
          .attr("height", datum => {
            return this.y(datum.value);
          });
        let texts = this.svg.selectAll("text.labels")
          .data(data)
          .attr("y", datum => {
            return this.height - this.y(datum.value);
          })
          .text(datum => {
            return datum.value.toFixed(1);
          });
        // enter
        rects.enter().append("svg:rect");
        texts.enter().append("svg:text");
        // exit
        rects.exit().remove();
        texts.exit().remove();
      },
      switchCamera() {},
    },
  }
</script>
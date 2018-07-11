const TRIM_SIZE = 640;

const videoHelper = {
  created() {
    window.requestAnimFrame = this.requestAnimFrame();
    window.cancelRequestAnimFrame = this.cancelRequestAnimFrame();
  },
  methods: {
    requestAnimFrame() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          return window.setTimeout(callback, 1000/60);
        };
    },
    cancelRequestAnimFrame() {
      return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        window.clearTimeout;
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
  }
};
export default videoHelper;

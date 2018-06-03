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
    supportsVideo() {
      return !!document.createElement('video').canPlayType;
    },
    supportsH264BaseLineVideo() {
      if (!this.supportsVideo()) {
        return false;
      }
      let v = document.createElement("video");
      return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    },
    supportsWebMVideo() {
      if (!this.supportsVideo()) {
        return false;
      }
      let v = document.createElement("video");
      return v.canPlayType('video/webm; codecs="vp8"');
    }
  }
};
export default videoHelper;

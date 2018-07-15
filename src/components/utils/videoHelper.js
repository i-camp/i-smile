const TRIM_SIZE = 640;

const videoHelper = {
  methods: {
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

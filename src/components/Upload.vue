<template>
  <div>
    <v-progress-linear
      color="secondary"
      height="20"
      v-model="progress"
    ></v-progress-linear>
  </div>
</template>

<script>
  import saveSnap from '@/components/utils/saveSnap'
  import firebaseApp from '@/utils/firebase'
  import * as uuidv4 from 'uuid/v4'

  export default {
    mixins: [
      saveSnap,
    ],
    props: {
      video: {
        type: HTMLCanvasElement,
        require: true,
      }
    },
    data() {
      return {
        progress: 0,
      }
    },
    mounted() {
      this.upload();
    },
    methods: {
      upload() {
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
    }
  };
</script>
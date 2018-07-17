<template>
  <div>
    <div v-if="!uploaded">
      <p class="headline text-xs-center">Uploading</p>
      <v-progress-linear
        color="secondary"
        height="30"
        v-model="progress"
      ></v-progress-linear>
    </div>
    <v-layout v-if="uploaded" justify-center>
      <v-btn
        dark
        large
        color="brown darken-2"
        @click="back"
      >Back</v-btn>
    </v-layout>
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
        uploaded: false,
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
              this.uploaded = true;
              this.$forceUpdate();
            });
          });
        });
      },
      back() {
        this.$router.push('/');
      }
    }
  };
</script>
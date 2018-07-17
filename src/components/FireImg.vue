<template>
  <silentbox-single
    v-if="loaded"
    :src="url">
  <img
    :src="url"
    width="100%"
    height="100%"/>
  </silentbox-single>
</template>

<script>
  import firebaseApp from '@/utils/firebase';

  export default {
    props: {
      path: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        loaded: false,
        url: '',
      }
    },
    mounted() {
      let storageRef = firebaseApp
          .storage()
          .ref()
          .child(this.$props.path);
      storageRef.getDownloadURL().then(url => {
        this.loaded = true;
        this.url = url;
      });
    },
  };
</script>

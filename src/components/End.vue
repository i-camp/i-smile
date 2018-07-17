<template>
  <v-layout row>
    <v-flex xs12 offset-sm3>
      <v-container fluid grid-list-sm>
          <v-layout row wrap>
          <v-flex v-for="(item, key) in lists" :key="key" xs4>
            <FireImg :path="`${item.photoPath}`"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import firebaseApp from '@/utils/firebase';
  import { mapState } from 'vuex';
  import FireImg from '@/components/FireImg.vue';

  export default {
    components: { FireImg },
    data() {
      return {
        lists: {},
      }
    },
    computed: {
      ...mapState('User', {
        uuid: state => state.uuid,
      })
    },
    mounted() {
      this.initHandler();
    },
    methods: {
      initHandler() {
        let query = firebaseApp.database().ref(`/snapEvents`);
        query.orderByChild('photographerId')
          .equalTo(this.uuid)
          .once('value', snapshot => {
            this.lists = Object.assign(this.lists, snapshot.val());
            this.$forceUpdate();
        });
      }
    }
  };
</script>

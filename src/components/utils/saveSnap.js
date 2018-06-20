import firebaseApp from '@/utils/firebase'
import { mapState } from 'vuex'

const saveSnap = {
  computed: {
    ...mapState(['User']),
  },
  methods: {
    async sendSnapEvent(to, imagePath, url) {
      firebaseApp.database().ref(`snapEvents`).push({
        photographerId: this.User.uuid,
        subjectId: to,
        photoUrl: url,
        photoPath: imagePath,
        createdAt: new Date().toISOString(),
      }, error => {
        if (error) {
          throw error;
        } else {
          return true;
        }
      });
    }
  },
};
export default saveSnap;

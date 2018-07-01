import VueRouter from 'vue-router'

import Start from '@/components/Start.vue'
import Reading from '@/components/Reading.vue'
import Generate from '@/components/Generate.vue'
import Emotiondetection from '@/components/Emotiondetection.vue'
 
const routes = [
  {
    path: '/',
    name: 'start',
    component: Start
  },
  {
    path: '/reading',
    name: 'reading',
    component: Reading,
  },
  {
    path: '/generate',
    name: 'generate',
    component: Generate,
  },
  {
    path: '/emotion/:uuid',
    name: 'emotiondetection',
    component: Emotiondetection
  },
];
 
const router = new VueRouter({ routes });
export default router;

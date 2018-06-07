import VueRouter from 'vue-router'
import { middleware, createMiddleware } from 'vue-router-middleware'

import Start from '@/components/Start.vue'
import Login from '@/components/Login.vue'
import Reading from '@/components/Reading.vue'
import Generate from '@/components/Generate.vue'
import Emotiondetection from '@/components/Emotiondetection.vue'

const FakeAuth = {
  isAuthenticated() {
    return true;
  }
};

// Pass middleware name and callback function
createMiddleware('require-auth', (args, to, from, next) => {
  if (FakeAuth.isAuthenticated()) {
    if (to.name === 'login') {
      next({ path: '/' });
      return;
    }
    next();
    return;
  }
  if (to.name === 'login') {
    next();
    return;
  }
  next({ path: '/login' });
});
 
const routes = [
  ...middleware('require-auth', [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
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
  ]),
];
 
const router = new VueRouter({ routes });
export default router;

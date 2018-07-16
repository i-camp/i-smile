<template>
  <v-container class="login--container" fluid fill-height>
    <v-layout row wrap align-end justify-center>
      <v-flex xs12>
        <form>
          <v-text-field
            class="input--name"
            dark
            v-model="name"
            :error-messages="nameErrors"
            :counter="10"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>

          <v-layout justify-center>
            <v-btn
              dark
              color="brown darken-2"
              @click="submit"
            >join</v-btn>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, minLength } from 'vuelidate/lib/validators'
  import User from '@/user'
  import * as uuidv4 from 'uuid/v4'

  export default {
    mixins: [validationMixin],
    validations: {
      name: { required, minLength: minLength(3) ,maxLength: maxLength(10) },
    },
    data(){
      return {
        name: '',
      }
    },
    computed: {
      nameErrors() {
        let errors = [];
        if (!this.$v.name.$dirty) return errors;
        !this.$v.name.minLength && errors.push('Name must be at more 3 characters long');
        !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long');
        !this.$v.name.required && errors.push('Name is required.');
        return errors;
      },
    },
    methods: {
      submit() {
        this.$v.$touch()
        if (this.$v.$error) return;
        User.setUser(
          this.name,
          uuidv4()
        ).then(() => {
          this.$router.push('/');
        });
      },
    }
  }
</script>

<style>
.login--container {
  background: url("/img/yasmile_01.jpg") no-repeat center;
  background-size: cover;
}
.input--name {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 5px;
}
.input--name label {
  position: absolute;
  top: 18px;
  left: 20px;
}
</style>

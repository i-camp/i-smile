<template>
  <v-container fluid fill-height>
    <v-layout row wrap align-center justify-center>
      <v-flex xs10>
        <form>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="10"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>

          <v-select
            :error-messages="selectErrors"
            :items="countries"
            v-model="country"
            label="Select Language"
            required
            @change="$v.country.$touch()"
            @blur="$v.country.$touch()"
          ></v-select>

          <v-layout>
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="submit">start</v-btn>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
  .container {
    background: url("/img/cover.jpg") no-repeat center;
    background-size: cover;
  }
</style>


<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, minLength } from 'vuelidate/lib/validators'
  import User from '@/user'
  import * as uuidv4 from 'uuid/v4'

  export default {
    mixins: [validationMixin],
    validations: {
      name: { required, minLength: minLength(3) ,maxLength: maxLength(10) },
      country: { required },
    },
    data(){
      return {
        name: '',
        country: null,
        countries: [
          "日本語",
          "English",
        ],
      }
    },
    computed: {
      selectErrors() {
        let errors = [];
        if (!this.$v.country.$dirty) return errors;
        !this.$v.country.required && errors.push('Item is required');
        return errors;
      },
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
        let country;
        for (let key in this.countries) {
          if (this.country === this.countries[key]) {
            country = key;
          }
        }
        User.setUser(
          this.name,
          country,
          uuidv4()
        );
        this.$router.push('/');
      },
    }
  }
</script>

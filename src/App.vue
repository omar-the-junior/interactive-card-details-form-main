<template>
  <div class="main-container grid">
    <div class="card-container">

      <div class="card-container__card card-container__card--front">

        <img src="../public/images/card-logo.svg">
        <p class="card-container__card-number">{{ this.cardNumber || '0000 0000 0000 0000' }}</p>
        <div class="flex card-container__info-group">

          <p class="card-container__user-name">{{ this.name || 'Jane Appleseed' }}</p>
          <p class="card-container__date">{{ this.expirationDate.month || '00' }}/{{ this.expirationDate.year || '00' }}
          </p>

        </div>

      </div>
      <div class="card-container__card card-container__card--back">

        <p class="card-container__cvc">{{ this.cvc || '000' }}</p>

      </div>

    </div>
    <div class="form-container grid">

      <div class="form-container__placeholder"></div>
      <div class="form-container__content grid">

        <form class="form" @submit.prevent="submitForm" v-if="!formSubmitted">

          <label for="cardholder-name" class="form__input flex flex--column">CARDHOLDER NAME
            <input :class="{ 'form__input-field--error': v$.name.$error }" v-model="name" class="form__input-field"
              id="cardholder-name" type="text" placeholder="e.g. Jane Appleseed">
            <div class="form__error-container" v-for="error of v$.name.$errors" :key="error.$uid">
              <p class="form__error">
                {{ error.$message }}
              </p>
            </div>
          </label>

          <label for="card-number" class="form__input flex flex--column">CARD NUMBER
            <input v-model="cardNumber" :class="{ 'form__input-field--error': v$.cardNumber.$error }"
              v-maska="'#### #### #### ####'" class="form__input-field" id="card-number"
              placeholder="e.g. 1234 5678 9123 0000">
            <div class="form__error-container" v-for="error of v$.cardNumber.$errors" :key="error.$uid">
              <p class="form__error">
                {{ error.$message }}
              </p>
            </div>
          </label>

          <div class="form__input-group flex">

            <label for="exp-date--month" class="form__input flex flex--column">EXP. DATE (MM/YY)
              <div class="form__input-field-group flex exp-date-input-group">

                <input v-maska="'##'" :class="{ 'form__input-field--error': v$.expirationDate.month.$error }"
                  v-model="expirationDate.month" class="form__input-field" id="exp-date--month" type="month"
                  placeholder="MM">
                <input v-maska="'##'" :class="{ 'form__input-field--error': v$.expirationDate.year.$error }"
                  v-model="expirationDate.year" class="form__input-field" id="exp-date--year" type="year"
                  placeholder="YY">

              </div>
              <div class="form__error-container" v-for="error of v$.expirationDate.$errors" :key="error.$uid">
                <p class="form__error">
                  {{ error.$message }}
                </p>
              </div>
            </label>

            <label for="cvc" class="form__input flex flex--column">CVC
              <div class="form__input-field-group flex">
                <input v-model="cvc" v-maska="'###'" :class="{ 'form__input-field--error': v$.cvc.$error }"
                  class="form__input-field" id="cvc" type="number" placeholder="e.g. 123">
              </div>
              <div class="form__error-container" v-for="error of v$.cvc.$errors" :key="error.$uid">
                <p class="form__error">
                  {{ error.$message }}
                </p>
              </div>
            </label>

          </div>

          <button class="btn btn--full-width">Confirm</button>

        </form>

        <div class="flex flex--column submission-result" v-if="formSubmitted">
          <img src="../public/images/icon-complete.svg" alt="completion icon">
          <h2 class="submission-result__heading">Thank you!</h2>
          <p class="submission-result__paragraph">We've added your card details</p>
          <button class="btn btn--full-width submission-result__btn">Continue</button>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

import usevuelidate from '@vuelidate/core'
import { required, helpers, minValue, maxValue, maxLength, numeric, minLength } from '@vuelidate/validators'

export default {
  name: 'App',
  setup() {
    return { v$: usevuelidate() }
  },
  data() {
    return {
      formSubmitted: false,
      name: '',
      cardNumber: '',
      expirationDate: {
        month: '',
        year: ''
      },
      cvc: ''
    }
  },
  validations() {
    return {
      name: {
        required: helpers.withMessage('Can\'t be blank ', required),
      },
      cardNumber: {
        required: helpers.withMessage('Can\'t be blank', required),
        minLength: helpers.withMessage('Card number must be exactly 16 digits', minLength(19)),
        maxLength: helpers.withMessage('Card number must be exactly 16 digits', maxLength(19))
      },
      expirationDate: {
        month: {
          required: helpers.withMessage('Can\'t be blank', required),
          minValue: helpers.withMessage('Insert a correct Month', minValue(1)),
          maxValue: helpers.withMessage('Insert a correct Month', maxValue(12)),
          minLength: minLength(1),
          maxLength: maxLength(2)
        },
        year: {
          required: helpers.withMessage('Can\'t be blank', required),
          minValue: helpers.withMessage('The year must be after 2021', minValue(22)),
          minLength: minLength(1),
          maxLength: maxLength(2)
        }
      },
      cvc: {
        required: helpers.withMessage('Can\'t be blank', required),
        maxLength: maxLength(3),
        minLength: helpers.withMessage('CVC must be exatly 3 digits', minLength(3)),
        numeric
      }
    }
  },
  methods: {
    async submitForm() {

      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) return

      this.formSubmitted = true;
    }
  },
  validationConfig: {
    $autoDirty: true
  }
}
</script>
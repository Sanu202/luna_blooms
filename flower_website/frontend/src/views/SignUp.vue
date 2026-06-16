<template>
  <div class="flex h-screen items-center justify-center">
    <div
      class="w-1/2 h-full flex justify-center items-center p-10 overflow-y-auto"
    >
      <div class="w-full max-w-md text-left">
        <img src="../assets/logo.png" alt="Logo" class="w-24 mb-4" />

        <h1 class="text-4xl font-bold text-[#D6336C] mb-6">
          Join our Luna Blooms
        </h1>

        <form @submit.prevent="signUp">
          <div>
            <label class="block mb-1">First Name:</label>
            <input
              v-model="firstName"
              type="text"
              placeholder="Enter your first name"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-4"
            />
          </div>

          <div>
            <label class="block mb-1">Last Name:</label>
            <input
              v-model="lastName"
              type="text"
              placeholder="Enter your last name"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-4"
            />
          </div>

          <div>
            <label class="block mb-1">Email Address:</label>
            <input
              v-model="email"
              type="email"
              placeholder="john@example.com"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-4"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Mobile Number:</label>

            <div class="flex gap-2 w-full">
              <input
                v-model="countryCode"
                list="country-codes"
                class="w-24 border-2 border-gray-300 rounded-md p-2"
              />

              <input
                v-model="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                class="flex-1 border-2 border-gray-300 rounded-md p-2"
              />
            </div>

            <datalist id="country-codes">
              <option value="+1">United States</option>
              <option value="+44">United Kingdom</option>
              <option value="+91">India</option>
              <option value="+61">Australia</option>
              <option value="+94">Sri Lanka</option>
            </datalist>
          </div>

          <div>
            <label class="block mb-1">Password:</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-4"
            />
          </div>

          <div>
            <label class="block mb-1">Confirm Password:</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-4"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-[#FF4081] mt-5 text-white py-2 px-4 rounded-md hover:bg-[#C22A5A]"
          >
            Sign Up
          </button>

          <p class="text-center text-sm text-gray-600 mt-6 mb-4">
            Or Sign Up with
          </p>

          <div class="flex justify-center gap-4">
            <button
              type="button"
              class="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                class="w-5 h-5"
              />
              <span class="text-sm">Google</span>
            </button>

            <button
              type="button"
              class="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
                alt="Facebook"
                class="w-5 h-5"
              />
              <span class="text-sm">Facebook</span>
            </button>
          </div>

          <p class="text-center text-sm text-gray-500 mt-6">
            Already have an account?
            <RouterLink to="/login" class="text-[#FF4081] underline hover:text-[#C22A5A]">
              Sign in
            </RouterLink>
          </p>

          <p v-if="successMessage" class="text-green-600 mt-4">
            {{ successMessage }}
          </p>

          <p v-if="errorMessage" class="text-red-600 mt-4">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>

    <div class="w-1/2 h-screen hidden md:block">
      <img
        src="../assets/signup.png"
        alt="Signup Image"
        class="w-full h-full object-cover object-right"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const countryCode = ref("+94");
const mobile = ref("");
const password = ref("");
const confirmPassword = ref("");

const successMessage = ref("");
const errorMessage = ref("");

async function signUp() {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value.toLowerCase(),
        mobile: countryCode.value + mobile.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    successMessage.value = data.message;

    firstName.value = "";
    lastName.value = "";
    email.value = "";
    countryCode.value = "+94";
    mobile.value = "";
    password.value = "";
    confirmPassword.value = "";
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Signup failed";
  }
}
</script>

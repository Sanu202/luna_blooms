<template>
  <div class="flex h-screen overflow-hidden">

    <div
      class="w-3/5 h-full flex justify-center items-center p-10 overflow-y-auto"
    >
      <div class="w-full max-w-md text-left">

        <img
          src="../assets/logo.png"
          alt="Logo"
          class="w-24 mb-4"
        />

        <h1 class="text-4xl font-bold text-[#D6336C] mb-6">
          Welcome Back
        </h1>

        <form @submit.prevent="signIn">

          <div>
            <label class="block mb-1 font-medium">
              Email Address:
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="john@example.com"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:border-[#FF4081]"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">
              Password:
            </label>

            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="block w-full border-2 border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:border-[#FF4081]"
            />
          </div>

          <div class="text-right mb-4">
            <a
              href="#"
              class="text-sm text-[#FF4081] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            class="w-full bg-[#FF4081] text-white py-2 px-4 rounded-md mt-4 hover:bg-[#C22A5A] transition"
          >
            Sign In
          </button>

          <p class="text-center text-sm text-gray-600 mt-6 mb-4">
            Or Sign In with
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

              <span class="text-sm">
                Google
              </span>
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

              <span class="text-sm">
                Facebook
              </span>
            </button>

          </div>

          <p class="text-center text-sm text-gray-500 mt-6">
            Don't have an account?

            <RouterLink
              to="/signup"
              class="text-[#FF4081] underline hover:text-[#C22A5A]"
            >
              Sign Up
            </RouterLink>
          </p>

          <p
            v-if="successMessage"
            class="text-green-600 mt-4 text-center"
          >
            {{ successMessage }}
          </p>

          <p
            v-if="errorMessage"
            class="text-red-600 mt-4 text-center"
          >
            {{ errorMessage }}
          </p>

        </form>
      </div>
    </div>

    <div class="w-2/5 h-screen hidden md:flex">

      <img
        src="../assets/login.png"
        alt="Signin Image"
        class="w-full h-full object-cover"
      />

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");

const successMessage = ref("");
const errorMessage = ref("");

async function signIn() {

  successMessage.value = "";
  errorMessage.value = "";

  try {

    const response = await fetch(
      "http://localhost:3000/signin",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.value.toLowerCase(),
          password: password.value,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Signin failed"
      );
    }

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    successMessage.value = data.message;

    email.value = "";
    password.value = "";

    console.log("JWT Token:", data.token);

    await router.push({ name: "home" });

  } catch (error) {

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Signin failed";
  }
}
</script>

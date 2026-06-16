<template>
  <div class="flex h-screen overflow-hidden">

    <div
      class="w-full h-full flex justify-center items-center p-10 overflow-y-auto"
    >
    <div
  class="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
>

        <img
          src="../assets/logo.png"
          alt="Logo"
          class="w-24 mb-4"
        />

        <h1 class="text-4xl font-bold text-[#D6336C] mb-6">
          Admin Login
        </h1>

        <form @submit.prevent="signIn">

          <div>
            <label class="block mb-1 font-medium">
              Email Address:
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
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
          email: email.value.trim().toLowerCase(),
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
      "expiresAt",
      data.expiresAt
    );

    localStorage.setItem(
      "admin",
      JSON.stringify(data.admin)
    );

    successMessage.value = data.message;

    email.value = "";
    password.value = "";

    await router.push({
      name: "admin-dashboard"
    });

  } catch (error) {
    console.error(error);

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Signin failed";
  }
}
</script>

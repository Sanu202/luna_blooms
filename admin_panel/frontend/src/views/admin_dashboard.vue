<template>
  <div class="flex h-screen">

    <aside class="w-1/4 p-6 bg-gray-100">
      <div>
        <img src="../assets/logo.png" alt="Logo" class="w-20 mb-4" />

        <h1 class="text-2xl font-bold text-[#D6336C] mb-6">
          Welcome Back <br />
          Admin!
        </h1>
      </div>

      <nav class="flex flex-col gap-5 items-start">
        <button>Dashboard</button>
        <button>Orders</button>
        <button>Products</button>
        <button>Customers</button>
        <button>Marketing</button>
        <button>Settings</button>
      </nav>
    </aside>

    <main class="w-3/4 p-6">
      <div class="flex justify-between items-center mb-8">
        <!-- Greeting -->
        <div>
          <h2 class="text-2xl font-bold">
            {{ greeting }}, {{ adminName }}
          </h2>

          <p class="text-gray-500">
            {{ formattedDate }}
          </p>
        </div>

        <div class="flex items-center gap-4">

          <button
            class="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div class="relative group">
            <div
              class="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold cursor-pointer"
            >
              {{ adminName.charAt(0) || "A" }}
            </div>

            <div
              class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3 hidden group-hover:block z-50"
            >
              <p class="font-semibold">
                {{ adminName }}
              </p>

              <p class="text-sm text-gray-500">
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="logout"
            class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            Logout
          </button>
        </div>
      </div>

      <div>
        <!-- Add cards, charts, tables, etc. here -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  clearAuth,
  getExpiryTime,
  isSessionExpired,
  recordSessionLogout,
} from "../utils/auth";

const router = useRouter();

const greeting = computed(() => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
});

const admin = JSON.parse(localStorage.getItem("admin") || "{}");

const adminName =
  `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || "Admin";

const formattedDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

let expiryTimer: number | undefined;

async function goToLoginIfExpired() {
  if (!isSessionExpired()) {
    return;
  }

  try {
    await recordSessionLogout();
  } catch (error) {
    console.error(error);
  }

  clearAuth();
  router.push({ name: "login" });
}

function startExpiryTimer() {
  const expiryTime = getExpiryTime();

  if (expiryTime === null) {
    goToLoginIfExpired();
    return;
  }

  const timeUntilExpiry = Math.max(expiryTime - Date.now(), 0);

  expiryTimer = window.setTimeout(async () => {
    await goToLoginIfExpired();
  }, timeUntilExpiry);
}

onMounted(async () => {
  await goToLoginIfExpired();
  startExpiryTimer();
});

onBeforeUnmount(() => {
  if (expiryTimer !== undefined) {
    window.clearTimeout(expiryTimer);
  }
});

async function logout() {
  try {
    await recordSessionLogout();
    clearAuth();
    router.push({ name: "login" });
  } catch (error) {
    console.error(error);
  }
}
</script>

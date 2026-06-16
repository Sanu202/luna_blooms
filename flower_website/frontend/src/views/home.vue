<template>
  <div class="bg-[#f8f5f4] min-h-screen">
    <nav
      class="flex items-center justify-between px-10 py-4 bg-white shadow-sm"
    >
      <div class="text-2xl font-bold text-[#D6336C]">Luna Blooms</div>

      <ul class="hidden md:flex gap-8 text-gray-700 font-medium">
        <li>
          <RouterLink to="/" class="hover:text-[#FF4081]">Home</RouterLink>
        </li>
        <li><a href="#" class="hover:text-[#FF4081]">Pages</a></li>
        <li><a href="#" class="hover:text-[#FF4081]">Browse Flowers</a></li>
        <li><a href="#" class="hover:text-[#FF4081]">Blog</a></li>
        <li><a href="#" class="hover:text-[#FF4081]">Contact</a></li>
      </ul>

      <RouterLink
        to="/login"
        class="bg-[#FF4081] text-white px-5 py-2 rounded-md hover:bg-[#C22A5A] transition"
      >
        Login
      </RouterLink>
    </nav>

    <section class="grid md:grid-cols-2 items-center px-10 py-14 bg-[#F9D9E3]">
      <div>
        <h1 class="text-5xl font-bold text-gray-800 leading-tight mb-6">
          The Best Flower to <br />
          Gift For Your Favorite One.
        </h1>

        <p class="text-gray-600 mb-8 leading-7">
            Discover fresh, beautiful flowers crafted with love for every special
  moment. From elegant bouquets to charming floral gifts, Luna Blooms
  brings happiness, beauty, and fragrance right to your doorstep.
        </p>

        <button
          class="bg-[#FF4081] text-white px-6 py-3 rounded-md hover:bg-[#C22A5A] transition"
        >
          Search Flowers
        </button>
      </div>

      <div class="flex justify-end items-end mt-10 md:mt-0">
        <img :src="homeImage" alt="Flowers" class="w-[650px] object-contain" />
      </div>
    </section>

    <section class="grid md:grid-cols-3 gap-6 px-10 py-10 bg-white">
      <div class="flex items-center gap-4">
        <div>
          <h3 class="font-bold text-lg">Free Shipping</h3>
          <p class="text-gray-500 text-sm">Free shipping all order</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div>
          <h3 class="font-bold text-lg">Support 24/7</h3>
          <p class="text-gray-500 text-sm">Support 24 hours a day</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div>
          <h3 class="font-bold text-lg">Money Return</h3>
          <p class="text-gray-500 text-sm">30 days for free return</p>
        </div>
      </div>
    </section>

    <section class="px-10 py-12">
      <div class="grid md:grid-cols-3 gap-5">
        <div class="relative overflow-hidden rounded-xl">
          <img :src="signupImage" class="w-full h-[320px] object-cover" />

          <div
            class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-md shadow"
          >
            Artificial Flower
          </div>
        </div>

        <div class="grid gap-5">
          <div class="relative overflow-hidden rounded-xl">
            <img :src="loginImage" class="w-full h-[150px] object-cover" />

            <div
              class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-md shadow"
            >
              Rose Flower
            </div>
          </div>

          <div class="relative overflow-hidden rounded-xl">
            <img :src="logoImage" class="w-full h-[150px] object-cover" />

            <div
              class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-md shadow"
            >
              Tulip Flower
            </div>
          </div>
        </div>

        <div class="relative overflow-hidden rounded-xl">
          <img :src="loginImage" class="w-full h-[320px] object-cover" />

          <div
            class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-md shadow"
          >
            Mixed Flower
          </div>
        </div>
      </div>
    </section>

    <section class="px-10 py-10">
      <h2 class="text-4xl font-bold text-center text-[#D6336C] mb-10">
        Our Product
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
        >
          <img
            :src="product.image"
            class="w-full h-40 object-cover rounded-lg mb-4"
          />

          <h3 class="font-semibold text-gray-700">
            {{ product.name }}
          </h3>

          <div class="flex items-center justify-between mt-3">
            <span class="text-[#FF4081] font-bold"> ${{ product.price }} </span>

            <button class="bg-[#FF4081] text-white w-8 h-8 rounded-md">
              +
            </button>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <button
          class="bg-[#FF4081] text-white px-8 py-3 rounded-md hover:bg-[#C22A5A] transition"
        >
          Search Flowers
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import loginImage from "../assets/login.png";
import logoImage from "../assets/logo.png";
import signupImage from "../assets/signup.png";
import homeImage from "../assets/home.png";

const products = [
  {
    id: 1,
    name: "Flowers Bouquet Pink",
    price: 5,
    image: homeImage,
  },
  {
    id: 2,
    name: "Rose Bouquet Red",
    price: 6,
    image: loginImage,
  },
  {
    id: 3,
    name: "Flowers Bouquet",
    price: 8,
    image: logoImage,
  },
  {
    id: 4,
    name: "Flower Bouquet White",
    price: 4,
    image: signupImage,
  },
  {
    id: 5,
    name: "Rose Bouquet",
    price: 5,
    image: loginImage,
  },
];
</script>

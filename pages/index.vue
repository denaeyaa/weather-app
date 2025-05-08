<template>
  <div class="min-h-screen bg-gray-100 py-8 flex flex-col items-center justify-start pt-16">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-500">Ayo cek cuaca dunia!</h2>
      <div class="mb-6 flex">
        <input
          v-model="searchQuery"
          type="text"
          id="location"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Masukkan nama kota atau negara"
        />
        <button
          @click="searchWeather"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
        >
          Cari
        </button>
      </div>

      <div v-if="weatherData" class="text-center">
        <h2 class="text-xl font-bold mb-2">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <img :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`" alt="Weather Icon" class="w-24 h-24 mx-auto">
        <p class="text-5xl font-semibold mb-2">{{ Math.round(weatherData.main.temp) }}°C</p>
        <p class="text-gray-600 capitalize mb-4">{{ weatherData.weather[0].description }}</p>
        <!--<div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
  <div class="flex items-center"></div>-->
    <!--<div class="flex items-center border-r border-b border-black-500 p-2">
    <Icon icon="fxemoji:blackdroplet" class="ml-5 mr-2" /> Kelembaban: {{ weatherData.main.humidity }}%
    </div>
  </div>
  <div class="flex items-center">
    <Icon icon="hugeicons:fast-wind" class="ml-5 mr-2" /> Angin: {{ weatherData.wind.speed }} m/s
  </div>
  <div class="flex items-center">
    <Icon icon="noto-v1:thermometer" class="ml-5 mr-2" /> Tekanan: {{ weatherData.main.pressure }} hPa
  </div>
  <div class="flex items-center">
    <Icon icon="fxemoji:snowflake" class="ml-5 mr-2" /> Suhu Min: {{ Math.round(weatherData.main.temp_min) }}°C
  </div>
  <div class="col-span-2 flex items-center justify-center">
    <Icon icon="noto:sun-behind-small-cloud" class="mr-2" /> Suhu Max: {{ Math.round(weatherData.main.temp_max) }}°C
  </div>-->
  <div class="grid grid-cols-3 gap-4 text-sm text-gray-500 text-center" style="color: black; font-weight: bold;">
  <div class="flex flex-col items-center justify-center">
    <Icon icon="bi:thermometer-snow" class="w-6 h-6 mb-1" /> {{ Math.round(weatherData.main.temp_min) }}°C
    <div class="text-xs">Min</div>
  </div>
  <div class="flex flex-col items-center justify-center border-l border-r border-gray-300" style="color: black; font-weight: bold;">
    <Icon icon="bi:thermometer-sun" class="w-6 h-6 mb-1" /> {{ Math.round(weatherData.main.temp_max) }}°C
    <div class="text-xs">Max</div>
  </div>
  <div class="flex flex-col items-center justify-center" style="color: black; font-weight: bold;">
    <Icon icon="hugeicons:fast-wind" class="w-6 h-6 mb-1" /> {{ weatherData.wind.speed }} m/s
    <div class="text-xs">Angin</div>
  </div>
  <div class="flex flex-col items-center justify-center" style="color: black; font-weight: bold;">
    <Icon icon="gravity-ui:droplet" class="w-6 h-6 mb-1" /> {{ weatherData.main.humidity }}%
    <div class="text-xs">Kelembaban</div>
  </div>
  <div class="flex flex-col items-center justify-center border-l border-r border-gray-300" style="color: black; font-weight: bold;">
    <Icon icon="mdi:barometer" class="w-6 h-6 mb-1" /> {{ weatherData.main.pressure }} hPa
    <div class="text-xs">Tekanan</div>
  </div>
  <div class="flex flex-col items-center justify-center" style="color: black; font-weight: bold;">
  <Icon icon="material-symbols:visibility-outline-rounded" class="w-6 h-6 mb-1" /> {{ (weatherData.visibility / 1000).toFixed(1) }} km
  <div class="text-xs">Visibilitas</div>
</div>

</div>
      </div>

      <div v-else-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>
      <div v-else-if="loading" class="text-gray-500 mt-4 text-center">Memuat data...</div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';

const searchQuery = ref('');
const weatherData = ref(null);
const loading = ref(false);
const error = ref('');
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
console.log(apiKey);

const debounceTimeout = ref(null);
const debounceDelay = 500; // Waktu tunda dalam milidetik (0.5 detik)

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    if (newValue.trim()) {
      searchWeather();
    } else {
      weatherData.value = null;
      error.value = '';
    }
  }, debounceDelay);
});

async function searchWeather() {
  if (!searchQuery.value.trim()) {
    error.value = 'Masukkan nama kota atau negara.';
    weatherData.value = null;
    return;
  }

  loading.value = true;
  error.value = '';
  weatherData.value = null;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery.value}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === 200) {
      weatherData.value = data;
    } else {
      error.value = `${data.message}`;
    }
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    error.value = 'Gagal mengambil data cuaca.';
  } finally {
    loading.value = false;
  }
}
</script>
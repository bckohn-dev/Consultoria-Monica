<template>
  <footer class="bg-gray-800 text-white py-6 mt-8">
    <div class="container mx-auto flex flex-col items-center space-y-4 text-sm text-center">
      <p class="text-white/80">&copy; 2025 Imobiliária. Todos os direitos reservados.</p>

      <div class="flex gap-6">
        <a
          href="https://www.tiktok.com/@monicanogueira211?_t=ZM-8wBoinpiCUJ&_r=1"
          class="flex items-center gap-2 hover:text-gold transition"
          target="_blank"
        >
          <Music class="w-4 h-4" />
          TikTok
        </a>
        <a
          href="https://www.instagram.com/monicanogueira156?utm_source=qr&igsh=MWlocWZ5cmw0a25maA=="
          class="flex items-center gap-2 hover:text-gold transition"
          target="_blank"
        >
          <Instagram class="w-4 h-4" />
          Instagram
        </a>
        <a
          href="https://kwai-video.com/u/@monicanogueira230/CoZIxgN7"
          class="flex items-center gap-2 hover:text-gold transition"
          target="_blank"
        >
          <Youtube class="w-4 h-4" />
          Kwai
        </a>
      </div>

      <p class="text-white/60">CreciSP 266907</p>
    </div>
  </footer>
</template>

<script setup>
import { Music, Instagram, Youtube } from 'lucide-vue-next';
</script>
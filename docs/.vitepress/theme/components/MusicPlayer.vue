<template>
  <div>
    <span>{{siteTitle}}</span>
    <span>{{siteDescription}}</span>
    <span>{{apiBaseUrl}}</span>
    <span>{{userName}}</span>
  </div>
</template>

<script setup>
const siteTitle = __SITE_TITLE__
const siteDescription = __SITE_DESCRIPTION__
const apiBaseUrl = __API_BASE_URL__
const userName = __USER_NAME__
</script>

<style scoped>

</style>
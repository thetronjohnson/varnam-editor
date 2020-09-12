<template>
    <div class="textarea">
        <v-textarea
          outlined
          name="translate"
          label="Type your content"
          rows="20"
          color="#4C5DF5"
        ></v-textarea>
    </div>
</template>

<script>
export default {
    name:'Editor',
}
</script>
<style>
.textarea{
    margin-left: 6vw;
    margin-right: 6vw;
}
</style>
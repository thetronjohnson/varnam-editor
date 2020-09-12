<template>
    <div class="addwords">
        <v-form>
            <v-row>
            <v-col :cols="5">
            <v-text-field
            label="English Word"
            outlined
            color="#4C5DF5"
          ></v-text-field>
            </v-col>
            <v-col :cols="5">
             <v-text-field
            label="The word in your language"
            outlined
            color="#4C5DF5"
          ></v-text-field>
            </v-col>
            <v-col :cols="2">
                 <div class="add-word">
          <v-btn depressed class="sug-add" color="#4C5DF5">Add Word</v-btn>
             </div>
            </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
export default {
    name:"AddWordsForm",
}
</script>

<style scoped>
.addwords{
    padding-top:5vh;
    margin-left: 5vw;
    margin-right: 5vw;
    padding-left: 10rem;
    padding-right: 10rem;
}
.sug-add{
    color: #fff;
    text-transform: capitalize;
    font-weight: 600;
    height: 3rem !important;
}
.v-col{
    height: 3rem !important;
}
</style>
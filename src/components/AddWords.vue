<template>
    <div class="main">
        <AddWordsForm/>
        <v-container class="wordsection">
         <div>
             <v-row no-gutters v-for="item in wordlist" :key="item.key" class="word">
            <v-col>
             <span class="english">{{item.english}}</span>
            </v-col>
            <v-col>
            <span class="regional">{{item.regional}}</span>
            </v-col>
            <v-col>
             <span class="votes">
             <v-btn depressed class="vote" color="#4C5DF5">
        <v-icon >mdi-arrow-up-box</v-icon>
        {{item.votes}}
      </v-btn>
             </span>
            </v-col>
             </v-row>
         </div>
        </v-container>
    </div>
</template>

<script>
import AddWordsForm from '@/components/addWordsForm.vue'
export default {
    name:"AddWords",
    components:{
        AddWordsForm
    },
    data:()=>{
        return{
        wordlist:[
            {key:1,english:'Firefox',regional:'ഫയർഫോക്സ് ',votes:50},
            {key:2,english:'Chrome',regional:'ക്രോം',votes:40},
            {key:3,english:'English',regional:'ഇംഗ്ലീഷ്',votes:100},
             
        ],
        }
    }
}
</script>

<style scoped>
.wordsection{
    padding-top:3vh;
    margin-left: 10vw;
    margin-right: 10vw;
    padding-left: 10rem;
    padding-right: 10rem;
}
.word{
    margin-bottom: 2vw;
    font-size: 20px;
    font-weight: 600;
}
.regional{
    margin-left: -1rem;
}
.vote{
    color: #fff;
    font-weight: 600;
    height: 3rem !important;
    width: 5rem !important;
}
.v-icon{
    padding-right: 3px;
}
</style>
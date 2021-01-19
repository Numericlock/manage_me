<template>
    <div class="modal" :style="{'background-color':'rgba(0, 0, 0,' + transparency}"></div>
</template>

<script>
    export default {
        props:{
            transparency:{
                default:0.7
            }
        },
        data () {
            return {
            }
        },
        components: {
        }
    }
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 900;
    }
</style>
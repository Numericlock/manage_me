<template>
    <div class="loading" :style="{'height': height +'px'}">
        <Rectangle 
            v-for="n in RectangleQuantity"
            :key="n" :delay="n" :width="width" :margin="margin" :color="color"/>
    </div>
</template>

<script>
    import Rectangle from './Rectangle'
    export default {
        props: {
            RectangleQuantity:{
                type: Number,
                default:8
            },
            height:{
                type: Number,
                default:40  
            },
            width:{
                type: Number,
                default:5
            },
            margin:{
                type: Number,
                default:3  
            },
            color:{
                default: "white",
            }
        },
        components: {
            Rectangle
        }
    }
</script>

<style>

    .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
    }
    @keyframes loading {
        0% {
            height: 0;
        }

        50% {
            height: 100%;
        }

        100% {
            height: 0;
        }
    }
</style>
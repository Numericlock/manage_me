<template>
    <div class="hand" :class="type" :style="{'transform': 'rotate(' + rotate + 'deg)'}" />
</template>

<script>
    export default {
        props: {
            rotate:{
                type:Number,
                default:0
            },
            type:{
                type:String
            }
        }
    }
</script>

<style scoped>
.hand {
    background-color: rgba(255,255,255,0.8);
}

.seconds {
    width: 1px;
    height: 150px;
    z-index:8;
    transform-origin: 0px 130px;
}

.minutes {
    width: 3px;
    height :150px;
    z-index:7;
    transform-origin: 1.5px 130px;
}

.hours {
    width: 5px;
    height: 100px;
    z-index:6;
    transform-origin: 2.5px 80px;
}
    
.alarm-minutes{
    width: 3px;
    height :150px;
    z-index:5;
    background-color: rgba(215,29,59,0.8);
    transform-origin: 1.5px 130px;
}
    
.alarm-hours{
    width: 5px;
    height: 100px;
    z-index:4;
    background-color: rgba(215,29,59,0.8);
    transform-origin: 2.5px 80px;
}
</style>
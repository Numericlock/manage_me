<template>
    <div class="obj" :style="{'animation-delay': delay/10 + 's',
                              'width': width +'px',
                              'margin': '0 ' + margin + 'px',
                              'background': color }"></div>
</template>

<script>
    export default {
        props: ['delay', 'width', 'margin', 'color'],
    }

</script>

<style scoped>
    .obj {
        height: 0;
        border-radius: 10px;
        animation: loading 0.8s infinite;
    }

</style>

<template>
    <div class="dials">
        <div 
            v-for="n in 60" 
            :key="n"
            :style="{
                'top':top(n) + 'px',
                'left': left(n) + 'px',
                'transform': 'rotate(' + rotate(n) + 'deg)'}"
            :class="['scale', {'fifth': n % 5 == 0}]">
            <p v-if="n % 5 == 0" 
               :style="{'transform': 'rotate(' + -rotate(n) + 'deg)'}">
                {{ n / 5 }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        top(val) {
            return 150 - Math.cos(Math.PI / 30 * val) * 150
        },

        left(val) {
            return 150 + Math.sin(Math.PI / 30 * val) * 150
        },

        rotate(val) {
            return 6 * val
        }
    }
}
</script>

<style scoped>
.dials {
    background-color: #333;
    border-radius: 300px;

    position: relative;

    height: 300px;
    width: 300px;
}

.scale {
    background-color: white;

    position: absolute;

    width: 1px;
    height: 10px;

    transform-origin: left top;

}

.fifth {
    width: 5px;
    height: 20px;
}

.fifth p {
    margin-top: 20px;
    margin-left: -15px;

    color: white;
    font-size: 28px;
    font-weight: bold;
    text-align: center;

    width: 35px;
}
</style>
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
        </div>
        <div 
            v-for="n in 24" 
            :key="`number-${n}`"
            :style="{
                'top':top(n*2.5) + 'px',
                'left': left(n*2.5) + 'px',
                'transform': 'rotate(' + rotate(n*2.5) + 'deg)'}"
            class="number-foundation">
            <p v-if="n % 1 == 0 " 
               :style="{'transform': 'rotate(' + -rotate(n*2.5) + 'deg)'}"
               class="number">
                {{ n }}
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
    background: rgba( 62, 62, 62, 0.50 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 5.0px );
    -webkit-backdrop-filter: blur( 5.0px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
}

.scale {
    background-color: white;

    position: absolute;

    width: 1px;
    height: 10px;

    transform-origin: left top;

}
    
.number-foundation {
    position: absolute;
    transform-origin: left top;

}

.fifth {
    width: 3px;
    height: 15px;
}

.number{
    margin-top: 20px;
    margin-left: -15px;

    color: white;
    font-size: 18px;
    font-weight: bold;
    text-align: center;

    width: 35px;
}
</style>
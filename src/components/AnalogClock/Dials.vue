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
            :key="n"
            :style="{
                'top':top(n*2.5) + 'px',
                'left': left(n*2.5) + 'px',
                'transform': 'rotate(' + rotate(n*2.5) + 'deg)'}"
            class="number-foundation">
            <p 
               :style="{'transform': 'rotate(' + -rotate(n*2.5) + 'deg)'}"
               :class="['number', {'three': n % 3 == 0},{'six': n % 6 == 0}]">
                {{ number(n) }}
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
        },
        
        number(n) {
            let num;
            if(n <= 12) num = n;
            else num = n-12;
            return num;
        } 
    }
}
</script>

<style scoped>
.dials {
    background-color: #333;
    background:linear-gradient(270deg, #f0bc68 0%, #f0bc68 50%, #c4d7d1 50%, #c4d7d1 100%);
    border-radius: 300px;

    position: relative;

    height: 300px;
    width: 300px;
}

.scale {
    background-color: black;

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

    color: black;
    font-size: 18px;
    font-weight: bold;
    text-align: center;

    width: 35px;
}
    
    .three {
        font-size: 22px;
    }
    
    .six{
        font-size: 22px;
        color:red;
    }
</style>
<template>
    <div>
        <div :class="['dials', {'dark': is_dark},{'light': !is_dark}]" v-if="clock_type=='analog_12'">
            <!--12時間表記-->
            <div v-for="n in 60" :key="n" :style="{
                    'top':top(n) + 'px',
                    'left': left(n) + 'px',
                    'transform': 'rotate(' + rotate(n) + 'deg)'}" :class="['scale', {'fifth': n % 5 == 0}]">
                <p v-if="n % 5 == 0" :style="{'transform': 'rotate(' + -rotate(n) + 'deg)'}" class="analog-12-num">
                    {{ n / 5 }}
                </p>
            </div>
        </div>
        <div :class="['dials', {'dark': is_dark},{'light': !is_dark}]" v-if="clock_type=='analog_24'">
            <!--２4時間表記-->
            <div v-for="n in 60" :key="n" :style="{
                    'top':top(n) + 'px',
                    'left': left(n) + 'px',
                    'transform': 'rotate(' + rotate(n) + 'deg)'}" :class="['scale', {'fifth': n % 5 == 0}]">
            </div>
            <div v-for="n in 24" :key="`number-${n}`" :style="{
                    'top':top(n*2.5) + 'px',
                    'left': left(n*2.5) + 'px',
                    'transform': 'rotate(' + rotate(n*2.5) + 'deg)'}" class="number-foundation">
                <p v-if="n % 1 == 0 " :style="{'transform': 'rotate(' + -rotate(n*2.5) + 'deg)'}" class="analog-24-num">
                    {{ n }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            clock_type: {
                default: 'analog_12'
            },
            is_dark: {
                default: false
            }
        },
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


    .number-foundation {
        position: absolute;
        transform-origin: left top;

    }

    .fifth {
        width: 3px;
        height: 15px;
    }

    .analog-12-num {
        margin-top: 20px;
        margin-left: -15px;
        font-size: 28px;
        font-weight: bold;
        text-align: center;

        width: 35px;
    }

    .analog-24-num {
        margin-top: 20px;
        margin-left: -15px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;

        width: 35px;
    }
</style>
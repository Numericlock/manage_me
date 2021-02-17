<template>
    <div class="clock">
        <dials :clockType="clockType" :isDark="isDark"/>
        <hand class="hand seconds" type="seconds"       :rotate="seconds"/>
        <hand class="hand minutes" type="minutes"       :rotate="minutes" />
        <hand class="hand hours"   type="hours"         :rotate="hours"/>
        <hand class="hand minutes" type="alarm-minutes" v-if="nextAlarmTime" :rotate="alarmMinutes"/>
        <hand class="hand hours"   type="alarm-hours"   v-if="nextAlarmTime" :rotate="alarmHours"/>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import Hand from './Hand.vue'
import Dials from './Dials.vue'
import moment from 'moment'
    
export type DataType = {
    intervalId: number;
    time: Date;
}
export default Vue.extend({
    components: {
        Hand,
        Dials
    },
    props:{
        clockType:{
            type: String,
            default:'analog_12'
        },
        isDark:{
            type: Boolean,
            default:false
        }
    },
    data(): DataType {
        return {
            intervalId:0 ,
            time: new Date()
        }
    },
    computed: {
        seconds(): number {
            const ss = moment(this.time).seconds();
            const nn = moment(this.time).milliseconds();
            return 6 * (ss + nn / 1000);
        },

        minutes(): number {
            const mm = moment(this.time).minutes();
            return 6 * (mm + this.seconds / 360);
        },

        hours(): number {
            const hh = moment(this.time).hours();
            return this.hoursDirection(hh,this.minutes,this.clockType);
        },
        
        alarmMinutes(): number {
            const mm = Number(this.$store.state.nextAlarmTime.substr(3,2));
            return 6 * mm;
        },
        
        alarmHours(): number {
            const hh = Number(this.$store.state.nextAlarmTime.substr(1,2));
            return this.hoursDirection(hh,this.alarmMinutes,this.clockType);
        },
        nextAlarmTime(): number {
            return this.$store.state.nextAlarmTime;
        }
    },

    methods: {
        setTime(): void {
            this.intervalId = window.setInterval(() => {
                this.time = new Date()
            }, 1000)
        },
        hoursDirection(hh: number,minutes: number,clockType: string): number{
            let direction;
            switch(clockType){
                case 'analog_12':
                    direction = 30 * (hh + minutes / 360);
                    break;
                case 'analog_24':
                    direction = 30 * ((hh + minutes / 360)/2);
                    break;
                default:
                    direction = 0;
                    break;
            }
            return direction;
        }
    },

    mounted(): void {
        this.setTime()
    },

    beforeDestroy(): void {
        clearInterval(this.intervalId)
    },
})
</script>

<style scoped>
.clock {
    position: relative;
}

.hand {
    position: absolute;
}

.seconds {
    left: 150px;
    top: 20px;
}

.minutes {
    left: 149px;
    top: 20px;
}

.hours {
    left: 148px;
    top: 70px;
}
    
.dark {
    background: rgba( 62, 62, 62, 0.50 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 5.0px );
    -webkit-backdrop-filter: blur( 5.0px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
}
</style>
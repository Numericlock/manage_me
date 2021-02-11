<template>
    <div class="clock">
        <dials :clock_type="clock_type" :is_dark="is_dark"/>
        <hand class="hand seconds" type="seconds"       :rotate="seconds"/>
        <hand class="hand minutes" type="minutes"       :rotate="minutes" />
        <hand class="hand hours"   type="hours"         :rotate="hours"/>
        <hand class="hand minutes" type="alarm-minutes" v-if="next_alarm_time" :rotate="alarm_minutes"/>
        <hand class="hand hours"   type="alarm-hours"   v-if="next_alarm_time" :rotate="alarm_hours"/>
    </div>
</template>

<script>
import Hand from './Hand'
import Dials from './Dials'
import moment from 'moment'

export default {
    components: {
        Hand,
        Dials
    },
    props:{
        clock_type:{
            default:'analog_12'
        },
        is_dark:{
            default:false
        }
    },
    data() {
        return {
            intervalId: undefined,
            time: undefined,
        }
    },

    computed: {
        seconds() {
            let ss = moment(this.time).seconds();
            let nn = moment(this.time).milliseconds();
            return 6 * (ss + nn / 1000);
        },

        minutes() {
            let mm = moment(this.time).minutes();
            return 6 * (mm + this.seconds / 360);
        },

        hours() {
            let hh = moment(this.time).hours();
            return this.hours_direction(hh,this.minutes,this.clock_type);
        },
        
        alarm_minutes() {
            let mm = Number(this.$store.state.nextAlarmTime.substr(3,2));
            return 6 * mm;
        },
        
        alarm_hours(){
            let hh = Number(this.$store.state.nextAlarmTime.substr(1,2));
            return this.hours_direction(hh,this.alarm_minutes,this.clock_type);
        },
        next_alarm_time() {
            return this.$store.getters.nextTime;
        }
    },

    methods: {
        setTime() {
            this.intervalId = setInterval(() => {
                this.time = new Date()
            }, 1000)
        },
        hours_direction(hh,minutes,clock_type){
            let direction;
            switch(clock_type){
                case 'analog_12':
                    direction = 30 * (hh + minutes / 360);
                    break;
                case 'analog_24':
                    direction = 30 * ((hh + minutes / 360)/2);
                    break;
            }
            return direction;
        }
    },

    mounted() {
        this.setTime()
    },

    beforeDestroy() {
        clearInterval(this.intervalId)
    },
}
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
<template>
    <div class="clock">
        <dials />
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
            return 30 * (hh + this.minutes / 360);
        },
        
        alarm_minutes() {
            let mm = Number(this.$store.state.nextAlarmTime.substr(3,2));
            return 6 * mm;
        },
        
        alarm_hours(){
            let hh = Number(this.$store.state.nextAlarmTime.substr(1,2));
            return 30 * (hh + this.alarm_minutes / 360);
        },
        next_alarm_time() {
            return this.$store.getters.nextTime;
        }
    },

    methods: {
        setTime() {
            this.intervalId = setInterval(() => {
                this.time = new Date()
            }, 10)
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
</style>
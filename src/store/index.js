import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        count: 0,
        //alarmTimes: [],
        nextAlarmTime: null,
        currentTime: null,
    },
    getters: {
        nextTime (state) {
            var strTime = state.nextAlarmTime;
            if (strTime != null) {
                var dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][Number(strTime.substr(0,1))];
                var hours = strTime.substr(1,2);
                var minutes = strTime.substr(3,2);
                return hours + ":" + minutes + "(" + dayOfWeekStr + ")";
            }
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        // alarm_times_add: {
        //}
        next_alarm_refresh(state, payload) {
            state.nextAlarmTime = payload.time;
            console.log(state.nextAlarmTime);
        },
        current_time(state, payload) {
            state.currentTime = payload.time;
        }
    },
    actions: {
        next_alarm_refresh(context, payload){
            context.commit('next_alarm_refresh', payload);
        },
        current_time(context, payload){
            context.commit('current_time', payload);
        }
    }
})
store.commit('increment');

export default store
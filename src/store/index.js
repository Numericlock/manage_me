import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        //alarmTimes: [],
        nextAlarmTime: null,
        nextAlarmId:null,
        currentTime: null,
        alarmCount:null,
        days:[ "日", "月", "火", "水", "木", "金", "土" ]
    },
    getters: {
        nextTime (state) {
            var strTime = state.nextAlarmTime;
            if (strTime != null) {
                var dayOfWeekStr = state.days[Number(strTime.substr(0,1))];
                var hours = strTime.substr(1,2);
                var minutes = strTime.substr(3,2);
                return hours + ":" + minutes + "(" + dayOfWeekStr + ")";
            }
        },
        alarmCount(state){
            return state.alarmCount;
        }
    },
    mutations: {
        next_alarm_refresh(state, payload) {
            console.log(payload.time);
            console.log(payload.id);
            state.nextAlarmTime = payload.time;
            state.nextAlarmId = payload.id;
        },
        current_time(state, payload) {
            state.currentTime = payload.time;
        },
        alarm_count(state, payload){
            state.alarmCount = payload.count;
        }
    },
    actions: {
        next_alarm_refresh(context, payload){
            context.commit('next_alarm_refresh', payload);
        },
        current_time(context, payload){
            context.commit('current_time', payload);
        },
        alarm_count(context, payload){
            context.commit('alarm_count', payload);
        }
    }
})
export default store
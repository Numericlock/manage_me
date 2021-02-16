import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //alarmTimes: [],
        nextAlarmTime: '',
        nextAlarmId:null,
        currentTime: null,
        alarmCount:null,
        days:[ "日", "月", "火", "水", "木", "金", "土" ],
        clockType:'analog_12',
        isDark:null
    },
    getters: {
        nextTime (state) {
            const nextAlarmTime: string = state.nextAlarmTime;
            let strTime;
            if (nextAlarmTime != null) {
                const dayOfWeekStr = state.days[Number(nextAlarmTime.substr(0,1))];
                const hours = nextAlarmTime.substr(1,2);
                const minutes = nextAlarmTime.substr(3,2);
                strTime = hours + ":" + minutes + "(" + dayOfWeekStr + ")";
            }else{
                strTime = null;
            }
            return strTime;
        },
        alarmCount(state){
            return state.alarmCount;
        }
    },
    mutations: {
        nextAlarmRefresh(state, payload) {
            state.nextAlarmTime = payload.time;
            state.nextAlarmId = payload.id;
        },
        currentTime(state, payload) {
            state.currentTime = payload.time;
        },
        alarmCount(state, payload){
            state.alarmCount = payload.count;
        }
    },
    actions: {
        nextAlarmRefresh(context, payload){
            context.commit('nextAlarmRefresh', payload);
        },
        currentTime(context, payload){
            context.commit('currentTime', payload);
        },
        alarmCount(context, payload){
            context.commit('alarmCount', payload);
        }
    },
  modules: {
  }
})

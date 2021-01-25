<template>
    <div class="wrapper">
        <AlarmModal ref="alarmModal" v-bind:title="title" v-bind:time="time" v-bind:sound_name="sound_name" />
        <!--<Header ref="nextAlarm2" v-bind:next_alarm_time="next_alarm_time" />-->
        
        <div class="content">
            <transition name="costom-transition" :enter-active-class="transition.enter" :leave-active-class="transition.leave">
                <router-view @nextAlarm='nextAlarm()' @openModal='openModal' v-bind:next_alarm_time="next_alarm_time" />
            </transition>
        </div>
        <Tabbar v-bind:carrentPage="carrentPage" />
    </div>
</template>
<script src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.2/dist/sql-wasm.js'></script>
<script>
    import AlarmModal from './components/Modal.vue'
    import Tabbar from './components/Tabbar.vue'
    const app = window.app;
    var Datastore = require('nedb');
    var path = require('path');
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        autoload: true
    });
    export default {
        name: 'app',
        components: {
            AlarmModal,
            Tabbar
        },
        data() {
            return {
                transition: {
                    enter: '',
                    leave: '',
                },
                title: null,
                time: null,
                sound_path: null,
                sound_name: null,
                alarm: null,
                carrentPage: "Home"
            };
        },
        computed: {
            next_alarm_time() {
                return this.$store.getters.nextTime;
            }
        },
        methods: {
            nextAlarm: function() {
                console.log("Run nextAlarm");
                var dateNow = new Date();
                var day = dateNow.getDay();
                var calcNum = Number(day + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2))+1;
                console.log(calcNum);
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.find({
                        type: "alarm",
                        isEnable: true
                    }, function(err, docs) {
                        var next_result = null;
                        var schedules = [];
                        docs.forEach((doc) => {
                            var time = doc.time;
                            var weeks = doc.weeks;
                            for (var i = 0; i < weeks.length; i++) {
                                schedules.push({
                                    "id": doc._id,
                                    "name": doc.name,
                                    "sound_id": doc.sound_id,
                                    "time": Number(weeks.substr(i, 1) + time)
                                });
                            }
                        });
                        schedules.sort(function(a, b) {
                            var one = a.time - calcNum;
                            var two = b.time - calcNum;
                            if (Math.sign(a.time - calcNum) == -1) one = a.time - calcNum + 62359;
                            else one = a.time - calcNum;
                            if (Math.sign(two) == -1) two = b.time - calcNum + 62359;
                            else two = b.time - calcNum;
                            if (one > two) return 1;
                            if (one < two) return -1;
                            return 0;
                        });
                        next_result = schedules[0];
                        if (!this.is_empty(next_result)) {
                            var strRepeat = this.zeroPadding(next_result.time, 5);
                            this.$store.dispatch('next_alarm_refresh', {
                                time: strRepeat,
                                id: next_result.id
                            });
                        } else {
                            //ここにアラームが何も無い場合の処理を記述
                            this.$store.dispatch('next_alarm_refresh', {
                                time: null,
                                id: null
                            });
                        }
                    }.bind(this));
                });
            },
            openAlarm:function(){
                var days = this.$store.state.days;
                var id = this.$store.state.nextAlarmId;
                var alarmTime = this.$store.state.nextAlarmTime;
                this.time = Number(alarmTime.substr(1, 2)) + ":" + alarmTime.substr(3, 2) + "(" + days[Number(alarmTime.substr(0, 1))] + ")";
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.findOne({
                        _id: id
                    }, function(err, doc) {
                        this.title = doc.name;
                        var Vm2 = this;
                        db.findOne({
                            _id: doc.sound_id
                        }, function(err, doc) {
                            if(doc){
                                Vm2.sound_path = doc.path;
                                Vm2.sound_name = doc.name;
                                Vm2.$refs.alarmModal.open(doc.path,true);
                            }else{
                                Vm2.sound_path = '';
                                Vm2.sound_name = '';
                                Vm2.$refs.alarmModal.open(null,true);
                            }
                        }.bind(Vm2));
                    }.bind(this));
                });
                this.nextAlarm();
            },
            openModal(...args){
                this.$refs.alarmModal.open(args[0],false);
                
            }
        },
        watch: {
            $route(to, from) {
                // アニメーションの切り替え
                this.carrentPage = to.name;
                console.log(to.name);
                if (to.meta.index == 7 || to.meta.index == 8) {
                    this.transition.enter = 'animate__animated animate__fadeIn';
                } else if (to.meta.index > from.meta.index) {
                    this.transition.enter = 'animate__animated animate__fadeInRight';
                } else {
                    this.transition.enter = 'animate__animated animate__fadeInLeft';
                }
            },
            next_alarm_time(val, old) {
                console.log("うごいてるよ");
                var alarmTime = this.$store.state.nextAlarmTime;
                var dateNow = new Date();
                var dayOfWeekStr = this.$store.state.days[dateNow.getDay()];
                var hours   = ("0" + dateNow.getHours()).slice(-2);
                var minutes = ("0" + dateNow.getMinutes()).slice(-2);
                var seconds = ("0" + dateNow.getSeconds()).slice(-2);
                var currentTime = String(dateNow.getDay()) + hours + minutes + seconds;
                console.log("alarmTime"+alarmTime);
                console.log("currentTime"+currentTime);
                if (alarmTime != null && currentTime != null) {
                    var alarmSeconds = to_minutes(alarmTime) * 60;
                    var currentSeconds = (to_minutes(currentTime) * 60) + Number(currentTime.substr(5, 2));
                    var sevenDaysSeconds = 604800;

                    function to_minutes(time) {
                        var result = (Number(time.substr(0, 1)) * 24 * 60) +
                            (Number(time.substr(1, 2)) * 60) +
                            Number(time.substr(3, 2));
                        return result;
                    }
                    var interval = 0;
                    if (currentSeconds < alarmSeconds) {
                        interval = (alarmSeconds - currentSeconds) * 1000;
                    } else if (alarmSeconds < currentSeconds) {
                        interval = ((sevenDaysSeconds - currentSeconds) + alarmSeconds) * 1000;
                    }
                    console.log(interval);
                    clearTimeout(this.alarm);
                    this.alarm = setTimeout(this.openAlarm, interval);
                }
            }
        },
        mounted: function() {
            this.nextAlarm();
        },
    };

</script>
<style>
    body * {
        font-family: "Helvetica Neue",
            Arial,
            "Hiragino Kaku Gothic ProN",
            "Hiragino Sans",
            Meiryo,
            sans-serif;
    }

    html {
        height: 100vh;
        width: 100vw;

    }

    #app {
        margin: none;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        font-weight: bolder;
        background: linear-gradient(-135deg, #E4A972, #9941D8),
        linear-gradient(75deg, #E4A972, #9941D8 ,#79ffff)fixed;
        border-radius: 15px;
        padding:0px 10px;
    }

    .content {
        height: 500px;
        max-height: 500px;
        float: left;
    }

    .animate__animated {
        --animate-duration: 300ms;
    }

    .animate__fadeIn {
        --animate-duration: 1000ms;
    }

</style>

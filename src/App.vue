<template>
    <div>
        <div :class="['dragbar', {'deep-dark': is_dark},{'deep-light': !is_dark}]"></div>
        <div class="wrapper">
            <AlarmModal ref="alarmModal" v-bind:title="title" v-bind:time="time" v-bind:sound_name="sound_name" />
            <div class="content">
                <transition name="costom-transition" :enter-active-class="transition.enter" :leave-active-class="transition.leave">
                    <router-view @nextAlarm='nextAlarm()' @openModal='openModal' v-bind:next_alarm_time="next_alarm_time" />
                </transition>
            </div>
            <Tabbar v-bind:carrentPage="carrentPage" />
        </div>
    </div>
</template>
<script src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.2/dist/sql-wasm.js'></script>
<script>
    import AlarmModal from './components/Modal.vue'
    import Tabbar from './components/Tabbar.vue'
    import db from './datastore'
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
            },
            clock_type() {
                return this.$store.state.clock_type;
            },
            is_dark:function(){
                return this.$store.state.is_dark;
            }
        },
        methods: {
            db_load_config: function() { //データベースからtype=configのデータを取得しstoreの対応する変数に入れる。
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.find({
                        type: "config"
                    }, function(err, docs) {
                        docs.forEach((doc) => {
                            switch (doc.key) {
                                case 'clock_type':
                                    this.$store.state.clock_type = doc.value;
                                    break;
                                case 'is_dark':
                                    this.$store.state.is_dark = doc.value;
                                    break;
                            }
                        });
                    }.bind(this));
                });
            },
            nextAlarm: function() {
                var dateNow = new Date();
                var day = dateNow.getDay();
                var calcNum = Number(day + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2)) + 1;
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
            openAlarm: function() {
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
                            if (doc) {
                                Vm2.sound_path = doc.path;
                                Vm2.sound_name = doc.name;
                                Vm2.$refs.alarmModal.open(doc.path, true);
                            } else {
                                Vm2.sound_path = '';
                                Vm2.sound_name = '';
                                Vm2.$refs.alarmModal.open(null, true);
                            }
                        }.bind(Vm2));
                    }.bind(this));
                });
                this.nextAlarm();
            },
            openModal(...args) {
                this.$refs.alarmModal.open(args[0], false);

            }
        },
        watch: {
            $route(to, from) {
                // アニメーションの切り替え
                this.carrentPage = to.name;
                if (to.meta.index == 7 || to.meta.index == 8) {
                    this.transition.enter = 'animate__animated animate__fadeIn';
                } else if (to.meta.index > from.meta.index) {
                    this.transition.enter = 'animate__animated animate__fadeInRight';
                } else {
                    this.transition.enter = 'animate__animated animate__fadeInLeft';
                }
            },
            next_alarm_time(val, old) {
                var alarmTime = this.$store.state.nextAlarmTime;
                var dateNow = new Date();
                var dayOfWeekStr = this.$store.state.days[dateNow.getDay()];
                var hours = ("0" + dateNow.getHours()).slice(-2);
                var minutes = ("0" + dateNow.getMinutes()).slice(-2);
                var seconds = ("0" + dateNow.getSeconds()).slice(-2);
                var currentTime = String(dateNow.getDay()) + hours + minutes + seconds;
                if (alarmTime != null && currentTime != null) {
                    var alarmSeconds = to_minutes(alarmTime) * 60;
                    var currentSeconds = (to_minutes(currentTime) * 60) + Number(currentTime.substr(5, 2));
                    var sevenDaysSeconds = 604800; //１週間の秒数

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
                    clearTimeout(this.alarm);
                    this.alarm = setTimeout(this.openAlarm, interval);
                }
            }
        },
        mounted: function() {
            this.nextAlarm();
            this.db_load_config();
        },
    };
</script>
<style lang="scss">
    body {
        overflow: hidden;
    }

    body * {
        font-family: "Helvetica Neue",
            Arial,
            "Hiragino Kaku Gothic ProN",
            "Hiragino Sans",
            Meiryo,
            sans-serif;
    }

    a:link {
        color: white;
        text-decoration: none;
    }

    .dragbar {
        height: 20px;
        width: 100%;
        -webkit-app-region: drag;
        -webkit-user-select: none;
        border-bottom-right-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }

    .wrapper {
        //背景
        display: flex;
        flex-direction: column;
        font-weight: bolder;
        background: linear-gradient(-135deg, rgba(228, 169, 114, 0.8), rgba(153, 65, 216, 0.8)),
            linear-gradient(75deg, rgba(228, 169, 114, 0.8), rgba(153, 65, 216, 0.8), rgba(121, 255, 255, 0.8))fixed;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        padding: 0px 10px;

        .content {
            height: 500px;
            max-height: 500px;
        }
    }

    .animate__animated {
        --animate-duration: 300ms;
    }

    .animate__fadeIn {
        --animate-duration: 1000ms;
    }

    .dark {
        color: white;
        fill: white;
        background: rgba(62, 62, 62, 0.50);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(5.0px);
        -webkit-backdrop-filter: blur(5.0px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .deep-dark {
        color: white;
        fill: white;
        background: rgba(62, 62, 62, 0.8);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(5.0px);
        -webkit-backdrop-filter: blur(5.0px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
    }

    .dark-color {
        color: white;
        fill: white;
    }

    .light {
        color: #383838;
        fill: #383838;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .deep-light{
        color: #383838;
        fill: #383838;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    .light-color {
        color: #383838;
        fill: #383838;
    }
</style>
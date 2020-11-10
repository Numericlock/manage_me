<template>
    <div class="wrapper">
        <AlarmModal ref="alarmModal" v-bind:title="title" v-bind:time="time" v-bind:sound_name="sound_name" />
        <Header ref="nextAlarm2" v-bind:next_alarm_time="next_alarm_time" />
        <div class="content">
            <transition name="costom-transition" :enter-active-class="transition.enter" :leave-active-class="transition.leave">
                <router-view @nextAlarm='nextAlarm()' v-bind:next_alarm_time="next_alarm_time" />
            </transition>
        </div>
        <div class="tabbar ">
            <router-link class="tabbar-icon-wrapper" to="/">
                <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                    <g>
                        <path class="st0" d="M392.859,6.031L123.288,66.938l0.91,1.692l-0.782-0.51L0,256.273l26.488,17.374l4.457-6.804v139.261
                        l254.107,99.866l209.756-104.105V228.575L512,221.753L392.859,6.031z M270.335,466.165l-91.76-36.065V325.503l-62.872-18.629v98.51
                        l-53.085-20.866V218.561l78.208-119.232l120.232,221.945l3.856-1.519l5.421-2.147V466.165z M463.136,382.226l-164.858,81.829
                        V306.52l164.858-65.383V382.226z"></path>
                    </g>
                </svg>
            </router-link>
            <router-link class="tabbar-icon-wrapper" to="/setting">
                <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                    <g>
                        <rect x="424" y="24" class="st0" width="48" height="52"></rect>
                        <rect x="424" y="188" class="st0" width="48" height="300"></rect>
                        <rect x="384" y="100" class="st0" width="128" height="64"></rect>
                        <rect x="231.985" y="24" class="st0" width="48" height="276.641"></rect>
                        <rect x="231.985" y="412.641" class="st0" width="48" height="75.359"></rect>
                        <rect x="191.985" y="324.641" class="st0" width="128" height="64"></rect>
                        <rect x="40" y="308" class="st0" width="48" height="180"></rect>
                        <rect x="40" y="24" class="st0" width="48" height="172"></rect>
                        <rect y="220" class="st0" width="128" height="64"></rect>
                    </g>
                </svg>
            </router-link>
        </div>
    </div>
</template>
<script src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.2/dist/sql-wasm.js'></script>
<script>
    import Header from './components/Header.vue'
    import AlarmModal from './components/Modal.vue'
    const app = window.app;
    const cron = require('node-cron');
    var Datastore = require('nedb');
    var path = require('path');
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        autoload: true
    });
    const schedule_db = new Datastore({
        filename: path.join(app.getPath('userData'), '/schedule.db'),
        autoload: true
    });
    const sound_db = new Datastore({
        filename: path.join(app.getPath('userData'), '/sound.db'),
        autoload: true
    });
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getHours();
    export default {
        name: 'app',
        components: {
            Header,
            AlarmModal
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
            };
        },
        computed: {
            next_alarm_time() {
                return this.$store.getters.nextTime
            }
        },
        methods: {
            zeroPadding: function(num, length) {
                return ('0000000000' + num).slice(-length);
            },
            nextAlarm: function() {
                console.log("Run nextAlarm");
                var dateNow = new Date();
                var day = dateNow.getDay();
                var calcNum = Number(day + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2));
                schedule_db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    schedule_db.find({
                        "repeat": {
                            $gt: 0
                        },
                        isEnable: true
                    }).sort({
                        repeat: 1
                    }).exec(function(err, docs) {
                        var next_result = null;
                        for (let i = 0; i < docs.length; i++) {
                            if (calcNum < docs[i].repeat) {
                                next_result = docs[i];
                                break;
                            }
                        }
                        if (next_result == null) {
                            for (let i = docs.length - 1; i >= 0; i--) {
                                if (calcNum > docs[i].repeat) {
                                    next_result = docs[i];
                                    break;
                                }
                            }
                        }
                        if (next_result != null) {
                            var strRepeat = ('0000000000' + next_result.repeat).slice(-5);
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
            openAlarm() {
                var days = this.$store.state.days;
                var id = this.$store.state.nextAlarmId;
                var alarmTime = this.$store.state.nextAlarmTime;
                this.time = Number(alarmTime.substr(1, 2)) + ":" + alarmTime.substr(3, 2) + "(" + days[Number(alarmTime.substr(0, 1))] + ")";
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    console.log("load database completed.");
                    db.findOne({
                        _id: id
                    }, function(err, doc) {
                        this.title = doc.name;
                        var Vm2 = this;
                        sound_db.findOne({
                            _id: doc.sound_id
                        }, function(err, doc) {
                            Vm2.sound_path = doc.path;
                            Vm2.sound_name = doc.name;
                            Vm2.$refs.alarmModal.open(doc.path);
                        }.bind(Vm2));
                    }.bind(this));
                });
                this.nextAlarm();
            }
        },
        watch: {
            $route(to, from) {
                // アニメーションの切り替え
                if (to.meta.index == 7 || to.meta.index == 8) {
                    this.transition.enter = 'animate__animated animate__fadeIn';
                } else if (to.meta.index > from.meta.index) {
                    this.transition.enter = 'animate__animated animate__fadeInRight';
                } else {
                    this.transition.enter = 'animate__animated animate__fadeInLeft';
                }
            },
            next_alarm_time(val, old) {
                console.log("watch:" + val);
                var alarmTime = this.$store.state.nextAlarmTime;
                var currentTime = this.$store.state.currentTime;
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
    }

    .content {
        height: 400px;
        max-height: 400px;
        float: left;
    }

    .tabbar {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .tabbar-icon-wrapper {
        line-height: 50px;
    }

    .tabbar-icon-wrapper svg {
        width: 40px;
        height: 40px;
        vertical-align: middle;
        fill: rgb(75, 75, 75);

    }

    .tabbar-icon-wrapper svg:hover {
        fill: red;
    }

    .animate__animated {
        --animate-duration: 300ms;
    }

    .animate__fadeIn {
        --animate-duration: 1000ms;
    }

</style>

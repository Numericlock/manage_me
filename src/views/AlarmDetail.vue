<template>
    <div class="aleam-add-wrapper">
        <div class="title">
            <span>Edit Alarm</span>
        </div>
        <form>
            <div class="input-wrapper">
                <label>
                    Name
                </label>
                <input type="text" class="alarm-input" id="aleamName" placeholder="アラーム名" v-model="name">
            </div>
            <div class="input-wrapper">
                <label>
                    Repeat
                </label>
                <div>
                    <multiselect v-model="value" :value="value" :options="options" :multiple="true" :close-on-select="false" :clear-on-select="false" :searchable="false" :allow-empty="false" placeholder="複数選択" @select="onSelect" @remove="onRemove">
                    </multiselect>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Sound
                </label>
                <div>
                    <multiselect v-model="sound_value" deselect-label="Can't remove this value" placeholder="１つ選択" :options="sound_options" :searchable="false" :allow-empty="false">
                    </multiselect>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Time
                </label>
                <div>
                    <vue-timepicker v-model="time" id="timepicker" placeholder="時間を入力" hide-disabled-hours hide-disabled-minutes hide-clear-button></vue-timepicker>
                </div>
            </div>
            <div class="submit-wrapper">
                <span @click="open()">削除</span>
                <transition name="fade">
                    <span v-if="is_change" @click="change()">適用</span>
                </transition>
            </div>
        </form>
        <transition name="fade">
            <div class="modal" v-if="isOpen" @click="close()"></div>
        </transition>
        <transition name="fade">
            <div class="modal-content" v-show="isOpen">
                <div class="text-wrapper">
                    <span>てきすと</span>
                </div>
                <div class="button-wrapper">
                    <button class="delete-button" @click="alarmDelete()">削除</button>
                    <button class="cancel-button" @click="close()">キャンセル</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import VueTimepicker from 'vue2-timepicker'
    import 'vue2-timepicker/dist/VueTimepicker.css'
    const app = window.app;
    var Datastore = require('nedb');
    var path = require('path');
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        autoload: true
    });
    const sound_db = new Datastore({
        filename: path.join(app.getPath('userData'), '/sound.db'),
        autoload: true
    });

    export default {
        name: 'alarmDetail',
        props: ['alarmId'],
        components: {
            'vue-timepicker': VueTimepicker,
            Multiselect
        },
        data() {
            return {
                selected: null,
                name: null,
                time: {
                    HH: '00',
                    mm: '00'
                },
                value: [],
                schedule_ids: [],
                sound_value: null,
                options: ['毎日', '月', '火', '水', '木', '金', '土', '日'],
                sound_options: [],
                sound_data: [],
                sound_ids: [],
                is_enable: true, //alarmの初期値
                isOpen: false,
                is_change: false,
                changeCount: 0,
                borderCount: 5
            }
        },
        methods: {
            alarmDelete() {
                db.remove({
                    _id: this.$route.params.alarmId
                }, {
                    multi: true
                }, function(err, numRemoved) {
                    console.log(numRemoved);
                }.bind(this));
            },
            open() {
                this.isOpen = true;
            },
            close: function() {
                this.isOpen = false;
            },
            change: function() {
                if (!this.is_empty(this.name) && !this.is_empty(this.time) && !this.is_empty(this.value) && !this.is_empty(this.sound_value)) {
                    var id = this.$route.params.alarmId;
                    var sound_id = this.sound_ids[this.sound_options.indexOf(this.sound_value, 0)];
                    var type = "alarm";
                    var time = String(this.time.HH) + String(this.time.mm);
                    var days = this.$store.state.days;
                    var weeks_string_array = this.value;
                    var weeks_array = [];
                    var weeks;
                    
                    for (var i = 0; i < weeks_string_array.length; i++) {
                        if(weeks_string_array[i] != "毎日")weeks_array.push(days.indexOf(weeks_string_array[i]));
                    }
                    weeks_array.sort(function(a, b) {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    });
                    for (i = 0; i < weeks_array.length; i++) {
                        if (weeks) weeks += String(weeks_array[i]);
                        else weeks = String(weeks_array[i]);
                    }
                    var dbData = {
                        "type": type,
                        "name": this.name,
                        "time": time,
                        "weeks": weeks,
                        "sound_id": sound_id,
                        "isEnable": this.is_enable
                    };
                    var dateNow = new Date();
                    var next_alarm_id = this.$store.state.nextAlarmId;
                    var nextAlarm = this.$store.state.nextAlarmTime; //次のアラーム設定時刻 0~62359
                    var currentTime = String(dateNow.getDay()) + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2);
                    for (i = 0; i < this.value.length; i++) {
                        var time2 = Number(days.indexOf(this.value[i]) + this.time.HH + this.time.mm);
                        if (id != next_alarm_id) {
                            if (currentTime < time2 && time2 < nextAlarm) {
                                nextAlarm = time2;
                            } else if (nextAlarm < currentTime && currentTime < time2 && time2 <= 62359 || nextAlarm < currentTime && time2 < nextAlarm && 0 <= time2) {
                                nextAlarm = time2;
                            }
                        }
                    }
                    var strNextAlarm = ('0000000000' + nextAlarm).slice(-5);
                    console.log(strNextAlarm);
                    console.log(id);
                    //////ＮＥＸＴアラーム自身を更新時の処理を記述する必要あり
                    this.$store.dispatch('next_alarm_refresh', {
                        time: strNextAlarm,
                        id: id
                    });
                    db.update({
                        _id: id
                    }, {
                        $set: dbData
                    }, {}, function(err, numReplaced) {
                        if (err !== null) console.error(err);
                        console.log("isEnable:False," + 'Replaced:', numReplaced);
                        this.$router.push('/')
                    }.bind(this));
                }
            },
            onSelect(option) {
                if (option === '毎日') {
                    this.value.length = 0;
                    for (var i = 1; i < this.options.length; i++) {
                        this.value.push(this.options[i]);
                    }
                }
            },
            onRemove(option) {
                var value = this.value;
                if (option === '毎日') {
                    value.length = 0;
                } else if (value.indexOf('毎日') != -1) {
                    this.value.splice(value.indexOf('毎日'), 1);
                }
            },
            getSoundData() {
                sound_db.find({}, function(err, docs) {
                    docs.forEach((doc) => {
                        this.sound_options.push(doc.name);
                        this.sound_ids.push(doc._id);
                    })
                    this.sound_data = docs;
                }.bind(this));
            },
            getAlarmData(id) {
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.findOne({
                        _id: id
                    }, function(err, doc) {
                        var days = this.$store.state.days;
                        this.name = doc.name;
                        this.time.HH = doc.time.substr(0, 2);
                        this.time.mm = doc.time.substr(2, 2);
                        for (var i = 0; i < doc.weeks.length; i++) {
                            this.value.push(days[Number(doc.weeks.substr(i, 1))]);
                            if (i == 6) this.value.push("毎日");
                        }
                        sound_db.findOne({
                            _id: doc.sound_id
                        }, function(err, doc) {
                            this.sound_value = doc.name;
                        }.bind(this));
                    }.bind(this));
                });

            },
            changeCountUp() {
                this.changeCount++;
                if (this.changeCount > this.borderCount && !this.is_empty(this.name) && !this.is_empty(this.time) && !this.is_empty(this.value) && !this.is_empty(this.sound_value)) {
                    this.is_change = true;
                } else {
                    this.is_change = false;
                }
            }
        },
        mounted: function() {},
        created: function() {
            this.getSoundData();
            this.getAlarmData(this.$route.params.alarmId);
        },
        watch: {
            name() {
                this.changeCountUp();
            },
            time() {
                this.changeCountUp();
            },
            value() {
                this.changeCountUp();
            },
            sound_value() {
                this.changeCountUp();
            },
        }
    }

</script>
<style lang="scss" scoped>
    .aleam-add-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;

        .title {
            display: flex;
            justify-content: center;
            height:35px;
            font-size: 30px;
            flex-grow: 1;
            padding-top:10px;
        }

        form {
            display: flex;
            flex-direction: column;
            flex-grow: 5;

            .input-wrapper {
                display: flex;
                justify-content: space-around;
                min-height: 50px;
                margin-bottom: 10px;
                padding-right: 80px;

                label {
                    padding-left: 40px;
                    min-width: 100px;
                    width: 100px;
                    line-height: 50px;

                }

                .alarm-input {
                    flex-grow: 2;
                    min-height: 40px;
                    display: block;
                    padding: 8px 40px 0 8px;
                    border-radius: 5px;
                    border: 1px solid #e8e8e8;
                    background: #fff;
                    font-size: 14px;
                    font-weight: bolder;
                }

                .alarm-input:focus {
                    outline: none;
                }

                .alarm-input::placeholder {
                    color: #adadad !important;
                }

                div {
                    flex-grow: 2;

                    span {
                        width: 100% !important;

                        input {
                            width: 100% !important;
                            min-height: 40px;
                            display: block;
                            padding: 8px 40px 0 8px;
                            border-radius: 5px;
                            border: 1px solid #e8e8e8;
                            background: #fff;
                            font-size: 14px;
                            font-weight: bolder;
                            color: #35495e;

                        }

                        input:focus {
                            outline: none;
                        }

                        input::placeholder {
                            color: #adadad !important;
                        }

                        div {
                            width: 100% !important;

                            span {
                                text-align: end;
                            }

                            div {
                                width: 100% !important;
                            }
                        }
                    }

                    .multiselect__tag {
                        width: auto !important;
                    }

                    .vue__time-picker time-picker {
                        width: auto !important;
                        width: 100% !important;
                        color: red;

                        .vue__time-picker input.display-time {
                            width: auto !important;
                            width: 100% !important;

                            .dropdown drop-down {
                                width: 100% !important;
                            }
                        }
                    }
                }

            }

            .submit-wrapper {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-right: 100px;
                padding-left: 100px;

                button {
                    background: none;
                    border: none;
                    border-radius: 8px;
                    border: 1px solid #e8e8e8;
                    height: 40px;
                    padding: 10px 15px;
                }

                button:focus {
                    outline: none;
                }
            }
        }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1000;
    }

    .modal-content {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        opacity: 1;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px;
        height: 200px;
        width: 300px;
        border-radius: 5px;
        box-shadow: 0px 0px 10px #f00;
        background-color: white;
        z-index: 11200;

        .button-wrapper {
            display: flex;
            justify-content: space-around;

            button {
                width: 100px;
                border: none;
                background: none;
                border-radius: 15px;
                border: 2px ridge black;
                height: 50px;
                font-weight: bold;
                font-size: 16px;
            }

            .cancel-button {}

            .cancel-button:hover {}

            .delete-button {
                background-color: red;
                color: white;

            }

            .delete-button:hover {}
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        will-change: opacity;
        transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0
    }

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css">

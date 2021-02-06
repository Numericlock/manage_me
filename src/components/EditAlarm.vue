<template>
    <div v-show="display">
        <AttentionModal @submit='removeAlarm' ref="AttentionModal" v-bind:text="text" :is_dark="is_dark"/>
        <div @click="displayControl(false)">
            <ModalBackground transparency="0.1"/>
        </div>
        <div :class="['aleam-add-wrapper', {'dark': is_dark},{'light': !is_dark}]">
            <div class="title">
                <span v-if="this.state=='edit'">Edit Alarm</span>
                <span v-if="this.state=='add'">New Aleam</span>
            </div>
            <form>
                <div class="input-wrapper">
                    <label>
                        Name
                    </label>
                    <input type="text" class="alarm-input" id="aleamName" placeholder="アラーム名" v-model="alarm_name" @input="changeCheck()">
                </div>
                <div class="input-wrapper">
                    <label>
                        Repeat
                    </label>
                    <div>
                        <multiselect v-model="value"  :options="options" :multiple="true" :close-on-select="false" :clear-on-select="false" :searchable="false" :allow-empty="false" placeholder="複数選択" @select="onSelect" @remove="onRemove">
                        </multiselect>
                    </div>
                </div>
                <div class="input-wrapper">
                    <label>
                        Sound
                    </label>
                    <div>
                        <multiselect v-model="sound_value" @input="changeCheck()" deselect-label="Can't remove this value" placeholder="デフォルト" :options="sound_options" :searchable="false" :allow-empty="true">
                        </multiselect>
                    </div>
                </div>
                <div class="input-wrapper">
                    <label>
                        Time
                    </label>
                    <div>
                        <vue-timepicker v-model="time" @input="changeCheck()" id="timepicker" placeholder="時間を入力" hide-disabled-hours hide-disabled-minutes hide-clear-button></vue-timepicker>
                    </div>
                </div>
                <div class="submit-wrapper" :class="['submit-wrapper',{'submit-wrapper-add': this.state=='add'}]">
                    <span v-if="this.state=='edit'" @click="modal_open()">削除</span>
                    <transition v-if="this.state=='edit'" name="fade">
                        <span v-if="is_change" @click="updateAlarm()">適用</span>
                    </transition>
                    <span v-if="this.state=='add'" @click="alarmAdd">作成</span>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import VueTimepicker from 'vue2-timepicker'
    import AttentionModal from './AttentionModal.vue'
    import 'vue2-timepicker/dist/VueTimepicker.css'
    import ModalBackground from './ModalBackground'
    import db from '../datastore'

    export default {
        name: 'alarmDetail',
        props: {
            state:{
                default:'add'
            }
        },
        components: {
            'vue-timepicker': VueTimepicker,
            Multiselect,
            AttentionModal,
            ModalBackground
        },
        data() {
            return {
                alarm_name: null,
                time: {
                    HH: '00',
                    mm: '00'
                },
                value: [],
                alarm_id:null,
                sound_value: null,
                options: ['毎日', '月', '火', '水', '木', '金', '土', '日'],
                sound_options: [],
                sound_data: [],
                sound_ids: [],
                is_enable: true, //alarmの初期値
                is_change: false,
                is_mounted:false,
                text:"削除してもいいの？",
                display:false
            }
        },
        computed: {
            is_dark:function(){
                return this.$store.state.is_dark;
            }
        },
        methods: {
            initialize(){
                this.alarm_name = "";
                this.time.HH = '00';
                this.time.mm = '00';
                this.value = [];
                this.sound_value = [];
                
                
                this.is_mounted = false;
                this.is_change = false;
            },
            removeAlarm() {
                db.remove({
                    _id: this.alarm_id
                }, {
                    multi: true
                }, function(err, numRemoved) {
                    console.log(numRemoved);
                    this.$emit('run');
                }.bind(this));
            },
            modal_open(id){
                this.$refs.AttentionModal.open(id);  
            },
            alarmAdd() {
                //this.$emit('setCron', "a");
               // db.remove({}, { multi: true });
                if (!this.is_empty(this.alarm_name) && !this.is_empty(this.time) && !this.is_empty(this.value)) {
                    var type = "alarm";
                    var time = String(this.time.HH) + String(this.time.mm);
                    var days = this.$store.state.days;
                    var weeks_string_array = this.value;
                    var weeks_array = [];
                    var weeks,sound_id;
                    if(!this.is_empty(this.sound_value))sound_id = this.sound_ids[this.sound_options.indexOf(this.sound_value, 0)];
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
                        "name": this.alarm_name,
                        "time": time,
                        "weeks": weeks,
                        "sound_id": sound_id,
                        "isEnable": this.is_enable
                    };
                    db.insert(dbData, function(err, newDoc) {
                        console.log(newDoc);
                        var dateNow = new Date();
                        var days = this.$store.state.days;
                        var nextAlarm = this.$store.state.nextAlarmTime; //次のアラーム設定時刻 0~62359
                        var currentTime = String(dateNow.getDay()) + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2);
                        for (var i = 0; i < this.value.length; i++) {
                            var time = Number(days.indexOf(this.value[i]) + this.time.HH + this.time.mm);
                            if (currentTime < time && time < nextAlarm) {
                                nextAlarm = time;
                            } else if (nextAlarm < currentTime && currentTime < time && time <= 62359 || nextAlarm < currentTime && time < nextAlarm && 0 <= time) {
                                nextAlarm = time;
                            }
                        }
                        var strNextAlarm = this.zeroPadding(nextAlarm, 5);
                        this.$store.dispatch('next_alarm_refresh', {
                            time: strNextAlarm,
                            id: newDoc._id
                        });
                        // this.nextAlarm();
                        this.$emit('run');
                    }.bind(this));
                    //this.$emit('nextAlarm');
                    this.displayControl(false);
                } else {
                    console.log("value is empty");
                }
            },
            
            updateAlarm: function() {
                console.log(this.time.mm);
                if (!this.is_empty(this.alarm_name) && !this.is_empty(this.time) && !this.is_empty(this.value)) {
                    var id = this.alarm_id;
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
                        "name": this.alarm_name,
                        "time": time,
                        "weeks": weeks,
                        "sound_id": sound_id,
                        "isEnable": this.is_enable
                    };
                    //var dateNow = new Date();
                   //// var next_alarm_id = this.$store.state.nextAlarmId;
                    //var nextAlarm = this.$store.state.nextAlarmTime; //次のアラーム設定時刻 0~62359
                    //var currentTime = String(dateNow.getDay()) + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2);
                    //for (i = 0; i < this.value.length; i++) {
                    //    var daytime = Number(days.indexOf(this.value[i]) + this.time.HH + this.time.mm);
                    //    if (currentTime < daytime && daytime < nextAlarm) {
                    //        nextAlarm = daytime;
                    //    } else if (nextAlarm < currentTime && currentTime < daytime && daytime <= 62359 || nextAlarm < currentTime && daytime < nextAlarm && 0 <= daytime) {
                    //        nextAlarm = daytime;
                    //    }
                    //}
                    //var strNextAlarm = ('0000000000' + nextAlarm).slice(-5);
                    ////////ＮＥＸＴアラーム自身を更新時の処理を記述する必要あり
                    //this.$store.dispatch('next_alarm_refresh', {
                    //    time: strNextAlarm,
                    //    id: id
                    //});
                    db.update({
                        _id: id
                    }, {
                        $set: dbData
                    }, {}, function(err, numReplaced) {
                        if (err !== null) console.error(err);
                        console.log("isEnable:False," + 'Replaced:', numReplaced);
                        this.$emit('run');
                    }.bind(this));
                    this.displayControl(false);
                }
            },
            
            onSelect(option) {
                this.changeCheck();
                console.log("onselect");
                if (option === '毎日') {
                    this.value.length = 0;
                    for (var i = 1; i < this.options.length; i++) {
                        this.value.push(this.options[i]);
                    }
                }
            },
            
            onRemove(option) {
                console.log("onremove");
                this.changeCheck();
                var value = this.value;
                if (option === '毎日') value.length = 0;
                else if (value.indexOf('毎日') != -1) this.value.splice(value.indexOf('毎日'), 1);
            },
            
            displayControl( bool ){
                if(this.state == 'edit'){
                    this.value=[];
                }
                this.display = bool;  
                console.log(this.alarm_id);
            },
            
            setId(id){
              this.alarm_id = id;  
            },
            
            getSoundData() {
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.find({
                        type: "sound"
                    }, function(err, docs) {
                        docs.forEach((doc) => {
                            this.sound_options.push(doc.name);
                            this.sound_ids.push(doc._id);
                        })
                        this.sound_data = docs;
                    }.bind(this));
                });
            },
            getAlarmData(id) {
                this.initialize();
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.findOne({
                        _id: id
                    }, function(err, doc) {
                        var days = this.$store.state.days;
                        this.alarm_name = doc.name;
                        this.time.HH = doc.time.substr(0, 2);
                        this.time.mm = doc.time.substr(2, 2);
                        for (var i = 0; i < doc.weeks.length; i++) {
                            this.value.push(days[Number(doc.weeks.substr(i, 1))]);
                            if (i == 6) this.value.push("毎日");
                        }
                        if(!this.is_empty(doc.sound_id)){
                            db.findOne({
                                _id: doc.sound_id
                            },function(err, doc) {
                                this.sound_value = doc.name;
                                console.log(doc.name);
                                console.log("is_mounted");
                                this.is_mounted = true;
                            }.bind(this));
                        }else{
                            this.is_mounted = true;
                            console.log("is_mounted");
                        }
                    }.bind(this));
                });
            },
            changeCheck() {
                if(this.state=='edit'){
                    console.log("changeCheck");
                    if(this.is_mounted && !this.is_change){
                        if (!this.is_empty(this.alarm_name) && !this.is_empty(this.time) && !this.is_empty(this.value)) {
                            this.is_change = true;
                        } else {
                            this.is_change = false;
                        }
                    }
                }
            }
        },
        mounted: function() {
            
        },
        created: function() {
            this.getSoundData();
            //this.getAlarmData(this.alarm_id);
        },
        watch: {

        }
    }

</script>
<style lang="scss">
    .aleam-add-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index:1000;

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
            .submit-wrapper-add{
                justify-content: flex-end;
            }
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

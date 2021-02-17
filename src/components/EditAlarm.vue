<template>
    <div v-show="display">
        <AttentionModal @submit='removeAlarm' ref="AttentionModal" v-bind:text="text" :isDark="isDark"/>
        <div @click="displayControl(false)">
            <ModalBackground transparency="0.1"/>
        </div>
        <div :class="['aleam-add-wrapper', {'dark': isDark},{'light': !isDark}]">
            <div class="title">
                <span v-if="this.state=='edit'">Edit Alarm</span>
                <span v-if="this.state=='add'">New Aleam</span>
            </div>
            <form>
                <div class="input-wrapper">
                    <label>
                        Name
                    </label>
                    <input type="text" class="alarm-input" id="aleamName" placeholder="アラーム名" v-model="alarmName" @input="changeCheck()">
                </div>
                <div class="input-wrapper">
                    <label>
                        Repeat
                    </label>
                    <div>
                        <multiselect v-model="dayValue"  :options="options" :multiple="true" :close-on-select="false" :clear-on-select="false" :searchable="false" :allow-empty="false" placeholder="複数選択" @select="onSelect" @remove="onRemove">
                        </multiselect>
                    </div>
                </div>
                <div class="input-wrapper">
                    <label>
                        Sound
                    </label>
                    <div>
                        <multiselect v-model="soundValue" @input="changeCheck()" deselect-label="Can't remove this value" placeholder="デフォルト" :options="soundOptions" :searchable="false" :allow-empty="true">
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
                    <span v-if="this.state=='edit'" @click="modalOpen()">削除</span>
                    <transition v-if="this.state=='edit'" name="fade">
                        <span v-if="isChange" @click="updateAlarm()">適用</span>
                    </transition>
                    <span v-if="this.state=='add'" @click="alarmAdd">作成</span>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import Multiselect from 'vue-multiselect'
    import VueTimepicker from 'vue2-timepicker'
    import AttentionModal from './AttentionModal.vue'
    import 'vue2-timepicker/dist/VueTimepicker.css'
    import ModalBackground from './ModalBackground.vue'
    import db from '../datastore'
    export type DataType = {
        time: {
            HH: string;
            mm: string;
        };
        alarmName: string;
        dayValue: string[];
        alarmId: string;
        soundValue: string;
        options: string[];
        soundOptions: string[];
        soundData: string[];
        soundIds: string[];
        isEnable: boolean;
        isChange: boolean;
        isMounted: boolean;
        text: string;
        display: boolean;
        
    }
    export default Vue.extend({
        name: 'alarmDetail',
        props: {
            state:{
                type: String,
                default:'add'
            }
        },
        components: {
            'vue-timepicker': VueTimepicker,
            Multiselect,
            AttentionModal,
            ModalBackground
        },
        data(): DataType {
            return {
                alarmName: '',
                time: {
                    HH: '00',
                    mm: '00'
                },
                dayValue: [],
                alarmId:'',
                soundValue: '',
                options: ['毎日', '月', '火', '水', '木', '金', '土', '日'],
                soundOptions: [],
                soundData: [],
                soundIds: [],
                isEnable: true, //alarmの初期値
                isChange: false,
                isMounted:false,
                text:"削除してもいいの？",
                display:false
            }
        },
        computed: {
            isDark(): boolean{
                return this.$store.state.isDark;
            }
        },
        methods: {
            initialize(): void{
                this.alarmName = "";
                this.time.HH = '00';
                this.time.mm = '00';
                this.dayValue = [];
                this.soundValue = '';
                this.isMounted = false;
                this.isChange = false;
            },
            removeAlarm(): void{
                db.remove({
                    _id: this.alarmId
                }, {
                    multi: true
                }, () => {
                    this.$emit('run');
                }.bind(this));
            },
            modalOpen(id: string): void{
                this.$refs.AttentionModal.open(id);  
            },
            alarmAdd(): void{
                //this.$emit('setCron', "a");
               // db.remove({}, { multi: true });
                if (!this.isEmpty(this.alarmName) && !this.isEmpty(this.time) && !this.isEmpty(this.dayValue)) {
                    const type = "alarm";
                    const time = String(this.time.HH) + String(this.time.mm);
                    const days = this.$store.state.days;
                    const weeksStringArray = this.dayValue;
                    const weeksArray = [];
                    let weeks,soundId;
                    if(!this.isEmpty(this.soundValue))soundId = this.soundIds[this.soundOptions.indexOf(this.soundValue, 0)];
                    for (let i = 0; i < weeksStringArray.length; i++) {
                        if(weeksStringArray[i] != "毎日")weeksArray.push(days.indexOf(weeksStringArray[i]));
                    }
                    weeksArray.sort(function(a, b) {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    });
                    for (let i = 0; i < weeksArray.length; i++) {
                        if (weeks) weeks += String(weeksArray[i]);
                        else weeks = String(weeksArray[i]);
                    }
                    const dbData = {
                        "type": type,
                        "name": this.alarmName,
                        "time": time,
                        "weeks": weeks,
                        "soundId": soundId,
                        "isEnable": this.isEnable
                    };
                    db.insert(dbData, function(err: string, newDoc: string) {
                        if (err !== null) console.error(err);
                        const dateNow = new Date();
                        const days = this.$store.state.days;
                        let nextAlarm = this.$store.state.nextAlarmTime; //次のアラーム設定時刻 0~62359
                        const currentTime = String(dateNow.getDay()) + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2);
                        for (let i = 0; i < this.dayValue.length; i++) {
                            const time = Number(days.indexOf(this.dayValue[i]) + this.time.HH + this.time.mm);
                            if (currentTime < time && time < nextAlarm) {
                                nextAlarm = time;
                            } else if (nextAlarm < currentTime && currentTime < time && time <= 62359 || nextAlarm < currentTime && time < nextAlarm && 0 <= time) {
                                nextAlarm = time;
                            }
                        }
                        const strNextAlarm = this.zeroPadding(nextAlarm, 5);
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
                   // console.log("value is empty");
                }
            },
            
            updateAlarm(): void{
                if (!this.isEmpty(this.alarmName) && !this.isEmpty(this.time) && !this.isEmpty(this.dayValue)) {
                    const id = this.alarmId;
                    const soundId = this.soundIds[this.soundOptions.indexOf(this.soundValue, 0)];
                    const type = "alarm";
                    const time = String(this.time.HH) + String(this.time.mm);
                    const days = this.$store.state.days;
                    const weeksStringArray = this.dayValue;
                    const weeksArray = [];
                    let weeks;
                    for (let i = 0; i < weeksStringArray.length; i++) {
                        if(weeksStringArray[i] != "毎日")weeksArray.push(days.indexOf(weeksStringArray[i]));
                    }
                    weeksArray.sort(function(a: number, b: number) {
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    });
                    for (let i = 0; i < weeksArray.length; i++) {
                        if (weeks) weeks += String(weeksArray[i]);
                        else weeks = String(weeksArray[i]);
                    }
                    const dbData = {
                        "type": type,
                        "name": this.alarmName,
                        "time": time,
                        "weeks": weeks,
                        "soundId": soundId,
                        "isEnable": this.isEnable
                    };
                    db.update({
                        _id: id
                    }, {
                        $set: dbData
                    }, {}, function(err) {
                        if (err !== null) console.error(err);
                        this.$emit('run');
                    }.bind(this));
                    this.displayControl(false);
                }
            },
            
            onSelect(option) {
                this.changeCheck();
                if (option === '毎日') {
                    this.dayValue.length = 0;
                    for (let i = 1; i < this.options.length; i++) {
                        this.dayValue.push(this.options[i]);
                    }
                }
            },
            
            onRemove(option) {
                this.changeCheck();
                const dayValue = this.dayValue;
                if (option === '毎日') dayValue.length = 0;
                else if (dayValue.indexOf('毎日') != -1) this.dayValue.splice(dayValue.indexOf('毎日'), 1);
            },
            
            displayControl( bool ){
                if(this.state == 'edit'){
                    this.dayValue=[];
                }
                this.display = bool;  
            },
            
            setId(id){
              this.alarmId = id;  
            },
            
            getSoundData() {
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.find({
                        type: "sound"
                    }, function(err, docs) {
                        if (err !== null) console.error(err);
                        docs.forEach((doc) => {
                            this.soundOptions.push(doc.name);
                            this.soundIds.push(doc._id);
                        })
                        this.soundData = docs;
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
                        if (err !== null) console.error(err);
                        const days = this.$store.state.days;
                        this.alarmName = doc.name;
                        this.time.HH = doc.time.substr(0, 2);
                        this.time.mm = doc.time.substr(2, 2);
                        for (let i = 0; i < doc.weeks.length; i++) {
                            this.dayValue.push(days[Number(doc.weeks.substr(i, 1))]);
                            if (i == 6) this.dayValue.push("毎日");
                        }
                        if(!this.isEmpty(doc.soundId)){
                            db.findOne({
                                _id: doc.soundId
                            },function(err, doc) {
                                this.soundValue = doc.name;
                                this.isMounted = true;
                            }.bind(this));
                        }else{
                            this.isMounted = true;
                        }
                    }.bind(this));
                });
            },
            changeCheck() {
                if(this.state=='edit'){
                    if(this.isMounted && !this.isChange){
                        if (!this.isEmpty(this.alarmName) && !this.isEmpty(this.time) && !this.isEmpty(this.dayValue)) {
                            this.isChange = true;
                        } else {
                            this.isChange = false;
                        }
                    }
                }
            }
        },
        created: function() {
            this.getSoundData();
            //this.getAlarmData(this.alarmId);
        }
    })

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

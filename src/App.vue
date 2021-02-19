<template>
    <div class="wrapper">
        <AlarmModal ref="alarmModal" v-bind:title="title" v-bind:time="time" v-bind:soundName="soundName" />
        <!--<Header ref="nextAlarm2" v-bind:nextAlarmTime="nextAlarmTime" />-->
        
        <div class="content">
            <transition name="costom-transition" :enter-active-class="transition.enter" :leave-active-class="transition.leave">
                <router-view @nextAlarm='nextAlarm()' @openModal='openModal' v-bind:nextAlarmTime="nextAlarmTime" />
            </transition>
        </div>
        <Tabbar v-bind:carrentPage="carrentPage" />
    </div>
</template>
<script src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.2/dist/sql-wasm.js'></script>
<script lang="ts">
    import Vue from "vue"
    import AlarmModal from './components/Modal.vue'
    import Tabbar from './components/Tabbar.vue'
    import db from './datastore'
    export type DataType = {
        transition:{
            enter:string;
            leave:string;
        };
        title: string;
        time: string;
        soundPath: string;
        soundName: string;
        alarm: number;
        carrentPage: string;
        
    }
    export default Vue.extend({
        name: 'app',
        components: {
            AlarmModal,
            Tabbar
        },
        data(): DataType {
            return {
                transition: {
                    enter: '',
                    leave: '',
                },
                title: '',
                time: '',
                soundPath: '',
                soundName: '',
                alarm: 0,
                carrentPage: "Home"
            };
        },
        computed: {
            nextAlarmTime(): string{
                return this.$store.getters.nextTime;
            },
            clockType(){
                return this.$store.state.clockType;
            }
        },
        methods: {
            dbLoadConfig(): void { //データベースからtype=configのデータを取得しstoreの対応する変数に入れる。
                db.loadDatabase((error:any) => {
                    if (error !== null) console.error(error);
                    db.find({
                        type: "config"
                    }, function(this:any,err:any, docs:any) {
                        docs.forEach((doc:any) =>{
                            switch(doc.key){
                                case 'clockType':
                                    this.$store.state.clockType = doc.value;
                                    break;
                                case 'isDark':
                                    this.$store.state.isDark = doc.value;
                                    break;
                            }
                        });
                    }.bind(this));
                });
            },
            nextAlarm(): void {
                const dateNow = new Date();
                const day = dateNow.getDay();
                const calcNum = Number(day + ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2))+1;
                db.loadDatabase((error:any) => {
                    if (error !== null) console.error(error);
                    db.find({
                        type: "alarm",
                        isEnable: true
                    }, function(this:any,err:any, docs:any) {
                        let next_result:any = null;
                        const schedules:any = [];
                        docs.forEach((doc:any) => {
                            const time = doc.time;
                            const weeks = doc.weeks;
                            for (let i = 0; i < weeks.length; i++) {
                                schedules.push({
                                    "id": doc._id,
                                    "name": doc.name,
                                    "sound_id": doc.sound_id,
                                    "time": Number(weeks.substr(i, 1) + time)
                                });
                            }
                        });
                        schedules.sort((a:any, b:any)=> {
                            let one = a.time - calcNum;
                            let two = b.time - calcNum;
                            if (Math.sign(a.time - calcNum) == -1) one = a.time - calcNum + 62359;
                            else one = a.time - calcNum;
                            if (Math.sign(two) == -1) two = b.time - calcNum + 62359;
                            else two = b.time - calcNum;
                            if (one > two) return 1;
                            if (one < two) return -1;
                            return 0;
                        });
                        next_result = schedules[0];
                        if (next_result) {
                            const strRepeat = this.zeroPadding(next_result.time, 5);
                            this.$store.dispatch('nextAlarmRefresh', {
                                time: strRepeat,
                                id: next_result.id
                            });
                        } else {
                            //ここにアラームが何も無い場合の処理を記述
                            this.$store.dispatch('nextAlarmRefresh', {
                                time: null,
                                id: null
                            });
                        }
                    }.bind(this));
                });
            },
            openAlarm(): void{
                const days = this.$store.state.days;
                const id = this.$store.state.nextAlarmId;
                const alarmTime = this.$store.state.nextAlarmTime;
                (this as any).time = alarmTime.substr(1, 2) + ":" + alarmTime.substr(3, 2) + "(" + days[Number(alarmTime.substr(0, 1))] + ")";
                db.loadDatabase((error:any) => {
                    if (error !== null) console.error(error);
                    db.findOne({
                        _id: id
                    }, function(this:any, err:any, doc:any) {
                        this.title = doc.name;
                        const Vm2 = this;
                        db.findOne({
                            _id: doc.sound_id
                        }, function(err:any, doc:any) {
                            if(doc){
                                Vm2.soundPath = doc.path;
                                Vm2.soundName = doc.name;
                                Vm2.$refs.alarmModal.open(doc.path,true);
                            }else{
                                Vm2.soundPath = '';
                                Vm2.soundName = '';
                                Vm2.$refs.alarmModal.open(null,true);
                            }
                        }.bind(Vm2));
                    }.bind(this));
                });
                (this as any).nextAlarm();
            },
            openModal(...args:any): void{
                (this as any).$refs.alarmModal.open(args[0],false);
                
            }
        },
        watch: void{
            $route(to:any, from:any) {
                // アニメーションの切り替え
                (this as any).carrentPage = to.name;
                if (to.meta.index == 7 || to.meta.index == 8) {
                    (this as any).transition.enter = 'animate__animated animate__fadeIn';
                } else if (to.meta.index > from.meta.index) {
                    (this as any).transition.enter = 'animate__animated animate__fadeInRight';
                } else {
                    (this as any).transition.enter = 'animate__animated animate__fadeInLeft';
                }
            },
            nextAlarmTime(): void {
                const alarmTime = (this as any).$store.state.nextAlarmTime;
                const dateNow = new Date();
                const dayOfWeekStr = (this as any).$store.state.days[dateNow.getDay()];
                const hours   = ("0" + dateNow.getHours()).slice(-2);
                const minutes = ("0" + dateNow.getMinutes()).slice(-2);
                const seconds = ("0" + dateNow.getSeconds()).slice(-2);
                const currentTime = String(dateNow.getDay()) + hours + minutes + seconds;
                if (alarmTime != null && currentTime != null) {
                    const alarmSeconds = (this as any).toMinutes(alarmTime) * 60;
                    const currentSeconds = ((this as any).toMinutes(currentTime) * 60) + Number(currentTime.substr(5, 2));
                    const sevenDaysSeconds = 604800;//１週間の秒数
                    let interval:number = 0;
                    if (currentSeconds < alarmSeconds) {
                        interval = (alarmSeconds - currentSeconds) * 1000;
                    } else if (alarmSeconds < currentSeconds) {
                        interval = ((sevenDaysSeconds - currentSeconds) + alarmSeconds) * 1000;
                    }
                    clearTimeout((this as any).alarm);
                    (this as any).alarm = setTimeout((this as any).openAlarm, interval);
                }
                
            }
        },
        mounted(): void {
            (this as any).nextAlarm();
            (this as any).dbLoadConfig();
        },
    });

</script>
<style lang="scss">
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
    
    .wrapper { //背景
        display: flex;
        flex-direction: column;
        font-weight: bolder;
        background: linear-gradient(-135deg, #E4A972, #9941D8),
        linear-gradient(75deg, #E4A972, #9941D8 ,#79ffff)fixed;
        border-radius: 15px;
        padding:0px 10px;
      //  -webkit-app-region: drag;
    }

    .content {
        height: 500px;
        max-height: 500px;
    }

    .animate__animated {
        --animate-duration: 300ms;
    }

    .animate__fadeIn {
        --animate-duration: 1000ms;
    }
    .dark {
        color:white;
        fill:white;
        background: rgba( 62, 62, 62, 0.50 );
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 5.0px );
        -webkit-backdrop-filter: blur( 5.0px );
        border-radius: 10px;
        border: 1px solid rgba( 255, 255, 255, 0.18 );
    }
    .dark-color{
        color:white;
        fill:white;
    }
    .light {
        color:#383838;
        fill:#383838;
        background: rgba( 255, 255, 255, 0.25 );
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 4px );
        -webkit-backdrop-filter: blur( 4px );
        border-radius: 10px;
        border: 1px solid rgba( 255, 255, 255, 0.18 );
    }
    .light-color{
        color:#383838;
        fill:#383838;
    }

</style>

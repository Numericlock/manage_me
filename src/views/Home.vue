<template>
    <div class="home-wrapper">
        <div class="alarm-add-button" @click="addAlarmModal">
            <addButton :isDark="isDark"/>
        </div>
        <EditAlarm ref="EditAlarm" @run="getData" :state="this.modalType"/>
        <div class="clock-wrapper">
            <clock :clockType="clockType" :isDark="isDark"/>
        </div>
        <div :class="['aleam-lists', {'dark': isDark},{'light': !isDark}]">
            <div v-for="(alarm, key) in alarmData" :key="key" class="aleam">
                <div class="alarm-router" @click="alarmDetailModal(alarm._id)">

                    <div class="aleam-time">
                        <span>{{alarm.weeksString}}</span>
                        <span>{{alarm.displayTime}}</span>
                    </div>
                    <div class="aleam-sound">
                        <span>{{alarm.name}}</span>
                    </div>
                </div>
                <div class="block aleam-istrue-button">
                    <input data-index=alarm._id :id=alarm._id @click=toggleChange(alarm._id,alarm.isEnable) v-model=alarm.isEnable type="checkbox" />
                    <label :for=alarm._id></label>
                </div>
            </div>
            <div v-if="alarmCount" class="initial-text-area">
                <div>
                    <b>設定されたアラームがないやよ</b>
                    <p>早く設定しろやよ～</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import clock from '../components/AnalogClock/AnalogClock.vue'
    import addButton from '../components/DotPlusButton.vue'
    import EditAlarm from '../components/EditAlarm.vue'
    import db from '../datastore'
    export type DataType = {
        alarmData: string[];
        addAlarm: boolean;
        modalType: string;
    }
    export default Vue.extend({
        name: 'Home',
        components: {
            clock,
            addButton,
            EditAlarm
        },
        data(): DataType {
            return {
                alarmData: [],
                addAlarm:false,
                modalType:'',
            }
        },
        computed: {
            alarmCount(): boolean {
                const count = this.$store.getters.alarmCount;
                if (count == 0) return true
                else return false
            },
            clockType(): string{
                return this.$store.state.clockType;
            },
            isDark(): boolean{
                return this.$store.state.isDark;
            }
        },
        methods: {
            getData(): void {
                db.loadDatabase((error: string) => {
                    if (error !== null) console.error(error);
                });
                //db.find({}, function(err, docs) {
                db.find({
                    type: "alarm"
                }, function(err: string, docs: string[]) {
                    this.alarmData = docs;
                    const days = this.$store.state.days;
                    docs.forEach((doc: array) => {
                        const weeks = doc.weeks;
                        const time = doc.time;
                        const displayTime = time.substr(0, 2) + ":" + time.substr(2, 2);
                        let weeksString = '';
                        if (weeks == "0123456") {
                            weeksString = "毎日";
                        } else {
                            for (let i = 0; i < weeks.length; i++) {
                                if (weeksString == '') weeksString = days[Number(weeks.substr(i, 1))];
                                else weeksString += "/" + days[Number(weeks.substr(i, 1))];
                            }
                        }
                        doc.weeksString = weeksString;
                        doc.displayTime = displayTime;
                    });
                }.bind(this));
                db.count({}, (error, numOfDocs) => {
                    this.$store.dispatch('alarmCount', {
                        count: numOfDocs
                    });
                });
                this.$emit('nextAlarm');
            },
            toggleChange(id: string, isEnable: boolean): void {
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    let updateIsEnable;
                    if (isEnable) updateIsEnable = false;
                    else updateIsEnable = true;
                    db.update({
                        _id: id
                    }, {
                        $set: {
                            isEnable: updateIsEnable
                        }
                    }, {}, function(err) {
                        if (err !== null) console.error(err);
                        this.$emit('nextAlarm');
                    }.bind(this));
                });
            },
            addAlarmModal(): void{
                this.modalType = 'add';
                this.$refs.EditAlarm.initialize();
                this.$refs.EditAlarm.displayControl(true);
            },
            alarmDetailModal(id: string): void{
                this.modalType = 'edit';
                this.$refs.EditAlarm.setId(id);
                this.$refs.EditAlarm.getAlarmData(id);
                this.$refs.EditAlarm.displayControl(true);
            }
        },
        created(): void {
            this.getData();
        }
    })

</script>

<style lang="scss">
    
    .alarm-add-button{
        position: absolute;
        top:15px;
        left:15px;
    }
    
    .clock-wrapper{
        display: flex;
        justify-content: center;
        padding: 20px 0px;
    }

    /*スクロールバーの横幅指定*/
    .aleam-lists::-webkit-scrollbar {
        width: 10px;
    }

    /*スクロールバーの背景色・角丸指定*/
    .aleam-lists::-webkit-scrollbar-track {
        border-radius: 10px;
        background: #f2f2f2;
    }

    /*スクロールバーの色・角丸指定*/
    .aleam-lists::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba( 62, 62, 62, 0.50 );
    }

    .home-wrapper {
        display: flex;
        flex-direction: column;
        .aleam-lists {
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            height:150px;

            .aleam {
                display: flex;
                flex-direction: row;
                height: 50px;
                border-bottom: 1px solid rgba( 255, 255, 255, 0.18 );
                .alarm-router {
                    display: flex;
                    flex-grow: 6;
                    .aleam-time {
                        flex-grow: 3;
                        padding-left: 30px;
                        line-height: 50px;
                    }
                    .aleam-sound {
                        flex-grow: 3;
                        line-height: 50px;
                        font-size: 20px;
                        font-weight: 900;
                    }
                }
                .aleam-istrue-button {
                    line-height: 50px;
                }
            }
        }
    }

    .block input {
        display: none;
    }

    .block {
        width: 100px;
        position: relative;
        clear: both;
        margin: 0 0 25px;
        float: left;
    }

    .block span {
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1px;
        font-size: 15px;
        margin-left: 10px;
    }

    .block label {
        width: 50px;
        height: 30px;
        margin-top: 10px;
        box-sizing: border-box;
        border: 1px solid rgba( 255, 255, 255, 0.18 );
        float: left;
        border-radius: 100px;
        position: relative;
        cursor: pointer;
        transition: .3s ease;
    }

    input[type=checkbox]:checked+label {
        background: rgba( 0, 149, 70, 0.60 );
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 4px );
        -webkit-backdrop-filter: blur( 4px );
        border: 1px solid rgba( 255, 255, 255, 0.18 );
    }

    input[type=checkbox]:checked+label:before {
        top:4px;
        left: 23px;
    }

    .block label:before {
        transition: .3s ease;
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        left: 4px;
        top: 4px;
        box-sizing: border-box;
        border-radius: 100px;
        background: rgba( 255, 255, 255, 0.80 );
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 4px );
        -webkit-backdrop-filter: blur( 4px );
        border: 1px solid rgba( 255, 255, 255, 0.18 );
    }

    .initial-text-area {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;

        div {
            text-align: center;
        }
    }

</style>

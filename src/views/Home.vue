<template>
    <div class="home-wrapper">
        <div class="aleam-lists">
            <div v-for="(alarm, key) in alarm_data" :key="key" class="aleam">
                <router-link class="alarm-router" v-bind:to="{name: 'alarm.detail', params: {alarmId: alarm._id}}">

                    <div class="aleam-time">
                        <span>{{alarm.weeksString}}</span>
                        <span>{{alarm.displayTime}}</span>
                    </div>
                    <div class="aleam-sound">
                        <span>{{alarm.name}}</span>
                    </div>
                </router-link>
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

<script>
    const app = window.app;
    var Datastore = require('nedb');
    var path = require('path');
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        //filename: '../data.db',
        autoload: true
    });
    export default {
        name: 'Home',
        props: ['next_alarm_time'],
        data() {
            return {
                alarm_data: []
            }
        },
        computed: {
            alarmCount: function() {
                var count = this.$store.getters.alarmCount;
                if (count == 0) return true
                else return false
            }
        },
        methods: {
            getData: function() {
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                });
                //db.find({}, function(err, docs) {
                db.find({
                    type: "alarm"
                }, function(err, docs) {
                    this.alarm_data = docs;
                    var days = this.$store.state.days;
                    docs.forEach((doc) => {
                        var weeks = doc.weeks;
                        var time = doc.time;
                        var weeksString;
                        var displayTime;
                        if (weeks == "0123456") {
                            weeksString = "毎日";
                        } else {
                            for (var i = 0; i < weeks.length; i++) {
                                if (!weeksString) weeksString = days[Number(weeks.substr(i, 1))];
                                else weeksString += "/" + days[Number(weeks.substr(i, 1))];
                            }
                        }
                        doc.weeksString = weeksString;
                        displayTime = time.substr(0, 2) + ":" + time.substr(2, 2);
                        doc.displayTime = displayTime;
                    });
                }.bind(this));
                db.count({}, (error, numOfDocs) => {
                    this.$store.dispatch('alarm_count', {
                        count: numOfDocs
                    });
                });
            },
            toggleChange(id, isEnable) {
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    var update_is_enable;
                    if (isEnable) update_is_enable = false;
                    else update_is_enable = true;
                    db.update({
                        _id: id
                    }, {
                        $set: {
                            isEnable: update_is_enable
                        }
                    }, {}, function(err, numReplaced) {
                        if (err !== null) console.error(err);
                        console.log("isEnable:True," + 'Replaced:', numReplaced);
                        this.$emit('nextAlarm');
                    }.bind(this));
                });
            }
        },
        created() {
            this.getData();
            //this.$emit('nextAlarm');
        }
    }

</script>

<style lang="scss">
    a:link {
        color: #333;
        text-decoration: none;
    }

    .alarm-router {
        display: flex;
        flex-grow: 6;
    }

    /*スクロールバーの横幅指定*/
    .aleam-lists::-webkit-scrollbar {
        width: 15px;
    }

    /*スクロールバーの背景色・角丸指定*/
    .aleam-lists::-webkit-scrollbar-track {
        border-radius: 10px;
        background: #f2f2f2;
    }

    /*スクロールバーの色・角丸指定*/
    .aleam-lists::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #09C9D9;
    }

    .home-wrapper {
        display: flex;
        flex-direction: column;
    }

    .aleam-lists {
        display: flex;
        flex-direction: column;
        height: 400px;
        overflow-y: scroll;
    }

    .aleam {
        display: flex;
        flex-direction: row;
        height: 50px;
        border-bottom: 1px ridge black;
    }

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

    .aleam-istrue-button {
        line-height: 50px;
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
        border: 3px solid;
        float: left;
        border-radius: 100px;
        position: relative;
        cursor: pointer;
        transition: .3s ease;
    }

    input[type=checkbox]:checked+label {
        background: #55e868;
    }

    input[type=checkbox]:checked+label:before {
        left: 23px;
    }

    .block label:before {
        transition: .3s ease;
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        background: white;
        left: 2px;
        top: 2px;
        box-sizing: border-box;
        border: 3px solid;
        color: black;
        border-radius: 100px;
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

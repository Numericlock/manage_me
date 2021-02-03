<template>
    <div class="setting-wrapper">
        <div class="title">
            <span>Setting</span>
        </div>
        <div class="settings">
            <div class="input-wrapper">
                <label>
                    DarkThema
                </label>
                <div class="block aleam-istrue-button">
                    <span for="darkthema">{{toggleText}}</span>
                    <input data-index="0" id="darkthema" v-on:change="toggle" type="checkbox" />
                    <label for="darkthema"></label>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Add sound
                </label>
                <div class="block aleam-istrue-button">
                    <router-link class="tabbar-icon-wrapper" to="/sounds"><button>音楽を追加する</button></router-link>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Clock Type
                </label>
                <div>
                    <multiselect v-model="clock_type_value"  deselect-label="Can't remove this value" placeholder="デフォルト" :options="clock_types" :searchable="false" :allow-empty="false">
                    </multiselect>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Multiselect from 'vue-multiselect';
//    const app = window.app;
//    var Datastore = require('nedb');
//    var path = require('path');
   // const db = new Datastore({
   //     filename: path.join(app.getPath('userData'), '/alarm.db'),
   //     autoload: true
   // });
    export default {
        name: 'Setting',
        components:{
             Multiselect
        },
        data() {
            return {
                toggleText: "OFF",
                file_name: null,
                file_path: null,
                sound_docs: [],
                source: null,
                clock_type_value:'Analog Clock 12',
                clock_types:['Analog Clock 12','Analog Clock 24'],
                clock_types_db_name:['analog_12','analog_24']
            }
        },
        methods: {
            toggle: function() {
                if (this.toggleText == "OFF") {
                    this.toggleText = "ON";
                } else {
                    this.toggleText = "OFF";
                }
            },
            update_config: function(){
                
            }
        },
        mounted() {
            this.$emit('nextAlarm');
        }
    }

</script>

<style lang="scss">
    .setting-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;

        .title {
            display: flex;
            justify-content: center;
            height:35px;
            font-size: 30px;
            padding-top:10px;
        }

        .settings {
            display: flex;
            flex-direction: column;
            flex-grow: 5;
            padding: 0px 20px;

            .input-wrapper {
                display: flex;

                min-height: 50px;
                margin-bottom: 10px;

                label {

                    min-width: 30%;
                    width: 30%;
                    line-height: 50px;

                }

                .sound-input {
                    width: 60%;
                    display: flex;

                    .uploadButton {
                        display: inline-block;
                        position: relative;
                        overflow: hidden;
                        border-top-left-radius: 3px;
                        border-bottom-left-radius: 3px;
                        background: #099;
                        color: #fff;
                        text-align: center;
                        padding: 10px;
                        line-height: 30px;
                        width: 180px;
                        cursor: pointer;

                        input[type=file] {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            cursor: pointer;
                            opacity: 0;
                        }

                        .uploadValue {
                            display: none;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 3px;
                            padding: 3px;
                            color: #ffffff;
                        }
                    }

                    .uploadButton:hover {
                        background: #0aa;
                    }

                    button {
                        background: none;
                        background: #099;
                        color: #fff;
                        font-weight: bold;
                        font-size: 15px;
                        border: none;
                        border-top-right-radius: 3px;
                        border-bottom-right-radius: 3px;
                        height: 100%;
                        padding: 10px 15px;
                    }

                    button:focus {
                        outline: none;
                    }

                    button:hover {
                        background: #0aa;
                    }
                }

                .block {
                    padding-left: 90px;
                    width: 40%;
                    position: relative;
                    clear: both;
                    float: left;
                    line-height: 50px;

                    input {
                        display: none;
                    }

                    span {
                        text-transform: uppercase;
                        font-weight: bold;
                        letter-spacing: 1px;
                        font-size: 15px;
                        margin-left: 10px;
                    }

                    label {
                        width: 50px;
                        min-width: 50px;
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

                    label:before {
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
                }
            }
        }
    }

</style>

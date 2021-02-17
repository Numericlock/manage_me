<template>
    <div class="setting-wrapper">
        <div :class="['title', {'dark-color': isDark},{'light-color': !isDark}]">
            <span>Setting</span>
        </div>
        <div :class="['settings', {'dark': isDark},{'light': !isDark}]">
            <div class="input-wrapper">
                <label>
                    DarkThema
                </label>
                <div class="block aleam-istrue-button">
                    <input data-index="0" id="darkthema" type="checkbox" @click="updateConfig('isDark')" :checked="isDark"/>
                    <label for="darkthema"></label>
                </div>
            </div>
            <div class="input-wrapper">
                <label>
                    Clock Type
                </label>
                <div>
                    <multiselect v-model="clockTypeValue" @input="updateConfig('clockType')" deselect-label="Can't remove this value" placeholder="デフォルト" :options="clockTypes" :searchable="false" :allow-empty="false">
                    </multiselect>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue"
    import Multiselect from 'vue-multiselect';
    import db from '../datastore'
    export type DataType = {
        toggleText: string;
        clockTypeValue: string;
        clockTypes: string[];
        clockTypesDbName: string[];
        text: string;
    }
    export default Vue.extend({
        name: 'Setting',
        components:{
             Multiselect
        },
        data(): DataType {
            return {
                toggleText: "OFF",
                clockTypeValue:null,
                clockTypes:['Analog Clock 12','Analog Clock 24'],
                clockTypesDbName:['analog_12','analog_24'],
               // isDark_bool:null
            }
        },
        computed: {
            isDark:function(){
                return this.$store.state.isDark;
            }
        },
        methods: {
            updateConfig(key){
                const query = {type: 'config'};
                const update = {type: 'config'};
                const options = {upsert: true};
                switch(key){
                    case 'clockType': {
                        const clockType = this.clockTypesDbName[this.clockTypes.indexOf(this.clockTypeValue)];
                        query.key = key;
                        update.key = key;
                        update.value =  clockType;
                        this.$store.state.clockType = clockType;
                        break;
                    }
                    case 'isDark': {
                        query.key = key;
                        update.key = key;
                        if(this.$store.state.isDark) update.value = false;
                        else update.value = true;
                        this.$store.state.isDark = update.value;
                        break;
                    }
                        
                }
                
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    db.update(query, update, options, (error) => {
                        if (error !== null) console.error(error);
                    });
                });
            },
            getConfigData(){
                this.clockTypeValue =  this.clockTypes[this.clockTypesDbName.indexOf(this.$store.state.clockType)];
               // this.isDark_bool = this.$store.state.isDark;
            }
        },
        mounted() {
            this.$emit('nextAlarm');
            this.getConfigData();
        }
    })

</script>

<style lang="scss">
    .setting-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;

        .title {
            display: flex;
            justify-content: center;
            height:35px;
            font-size: 30px;
            padding:10px 0px;
        }

        .settings {
            display: flex;
            flex-direction: column;

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
                        border: 1px solid rgba( 255, 255, 255, 0.18 );
                        background: rgba( 65, 65, 65, 0.80 );
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

                    label:before {
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
                }
            }
        }
    }

</style>

<template>
    <div class="header-wrapper">
        <clock/>
        <div class="time-wrapper">
            <div class="time-now">
                <span class="animate__animated animate__bounce">{{ message }}</span>
            </div>
            <div class="next-alarm">
                <div class="text">
                    <span>Next Alarm Time: </span>
                    <span>{{ next_alarm_time }}</span>
                    <span v-if="next_alarm_time == null">ないやよー</span>
                </div>
            </div>
        </div>
        <div class="add-button">
            <router-link type="button" id="dotRadius" class="dotRadius" to="/alarm/add">
                <span class="plus"></span>
            </router-link>
        </div>
    </div>
</template>

<script>
    import clock from '../components/AnalogClock/AnalogClock.vue'
    export default {
        components: {
            clock
        },
        props: ['next_alarm_time'],
        data: function() {
            return {
                time: null
            }
        },
        computed: {
            message: function() {
                return this.time.toLocaleString()
            },
        },
        methods: {
            refresh: function() {
                var dateNow = new Date();
                var dayOfWeekStr = this.$store.state.days[dateNow.getDay()];
                var hours   = ("0" + dateNow.getHours()).slice(-2);
                var minutes = ("0" + dateNow.getMinutes()).slice(-2);
                var seconds = ("0" + dateNow.getSeconds()).slice(-2);
                var currentTime = String(dateNow.getDay()) + hours + minutes + seconds;
                this.$store.dispatch('current_time', {
                    time: currentTime
                });
                this.time = hours + ":" + minutes + ":" + seconds + "(" + dayOfWeekStr + ")";
                setTimeout(() => {
                    this.refresh()
                }, 1000);
            }
        },
        created: function() {
            this.refresh()
        }
    }
</script>

<style lang="scss">
    .header-wrapper {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid black;

        .time-wrapper {
            .time-now {
                font-size: 50px;
                text-align: center;
                border-bottom: 1px solid black;
            }

            .next-alarm {
                display: flex;
                flex-direction: row;
                height: 40px;

                .text {
                    flex-grow: 7;
                    text-align: center;
                    line-height: 40px;
                }
            }
        }

        .add-button {
            display: flex;
            justify-content: center;
            flex-grow: 3;
            line-height: 90px;
            $button_size: 80px;

            #dotRadius {
                -webkit-appearance: button;
                -webkit-writing-mode: horizontal-tb !important;
                letter-spacing: normal;
                word-spacing: normal;
                box-sizing: border-box;
                margin: 0em;
                font: 400 13.3333px Arial;
                padding: 1px 6px;
                border-width: 2px;
                background: transparent;
                border: double 2px #303136;
                border-style: dashed;
                border-radius: 100%;
                width: $button_size;
                height: $button_size;
                color: white;
                position: relative;
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
                -webkit-transition: -webkit-transform ease-out 200ms;
                transition: -webkit-transform ease-out 200ms;
                transition: transform ease-out 200ms;
                transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
                transition: border 0.3s;

                .plus {
                    display: block;
                    position: relative;
                    background: #303136;
                    width: 4px;
                    height: $button_size/2;
                    left: $button_size*0.37;
                    top: 23.5%;
                    border-radius: 20px;
                    transition: background-color 0.3s;
                }

                .plus:before {
                    content: "";
                    position: absolute;
                    background: #303136;
                    top: 50%;
                    left: ($button_size*-0.22);
                    width: $button_size/2;
                    height: 4px;
                    margin-top: -2px;
                    border-radius: 10px;
                    transition: background-color 0.3s;
                }
            }

            #dotRadius:hover {
                border: double 2px #fff;
                border-style: solid;
                color: black;
                transition: border 0.6s;

            }

            #dotRadius:focus {
                outline: none;
            }

            #dotRadius:hover>.plus {
                background: white;
                transition: background-color 0.3s;

            }

            #dotRadius:hover>.plus:before {
                background: white;
                transition: background-color 0.3s;

            }
        }
    }
</style>
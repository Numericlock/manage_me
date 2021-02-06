<template>
    <div v-show="display">
        <ModalBackground transparency="0.1" zIndex="10000"/>
        <transition name="fade">
            <div :class="['modal-content', {'dark': is_dark},{'light': !is_dark}]">
                <span class="title" v-if="isAlarm">{{ title }}</span>
                <span class="time" v-if="isAlarm">{{ time }}</span>
                <SoundAndVisualizer ref="SoundAndVisualizer" :hide_playback_button=true />
                <div>
                    <button class="close-button" @click="close()">STOP</button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import SoundAndVisualizer from './SoundAndVisualizer.vue'
    import ModalBackground from './ModalBackground.vue'
    export default {
        name: "Modal",
        props: ['title', 'time', 'sound_path', 'sound_name'],
        data: function() {
            return {
                display: false,
                isAlarm: true,
            };
        },
        computed: {
            is_dark:function(){
                return this.$store.state.is_dark;
            }
        },
        methods: {
            open(path,is_alarm) {
                this.$refs.SoundAndVisualizer.sound(path);
                this.isAlarm = is_alarm;
                this.displayControl(true);
            },
            close: function() {
                this.$refs.SoundAndVisualizer.close();
                this.displayControl(false);
            },
            displayControl( bool ){
                this.display = bool;  
            }
        },
        components: {
            SoundAndVisualizer,
            ModalBackground
        }
    };

</script>
<style lang="scss" scoped>
    .modal-content {
        text-align: center;
        display: flex;
        flex-direction: column;
        opacity: 1;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px;
        height: 400px;
        width: 300px;
        z-index: 11200;
        canvas {
            background-size: cover;
            border-radius: 15px;
        }

        .title {}

        .time {
            font-size: 20px;
        }

        div {
            .close-button {
                background: none;
                border: none;
                vertical-align: middle;
                width: 150px;
                height: 50px;
                margin: 15px;
                font-size: 30px;
                font-weight: bold;
                color:white;
                background: rgba( 255, 0, 0, 0.90 );
                box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
                backdrop-filter: blur( 4.5px );
                -webkit-backdrop-filter: blur( 4.5px );
                border-radius: 10px;
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

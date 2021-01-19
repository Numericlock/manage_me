<template>
    <div>
        <transition name="fade">
            <div class="modal" v-if="isOpen"></div>
        </transition>
        <transition name="fade">
            <div class="modal-content" v-show="isOpen">
                <span class="title" v-if="isAlarm">{{ title }}</span>
                <span class="time" v-if="isAlarm">{{ time }}</span>
                <SoundAndVisualizer ref="SoundAndVisualizer" />
                <div>
                    <button class="close-button" @click="close()">STOP</button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import SoundAndVisualizer from '../components/SoundAndVisualizer.vue'
    export default {
        name: "Modal",
        props: ['title', 'time', 'sound_path', 'sound_name'],
        data: function() {
            return {
                isOpen: false,
                isAlarm: true,
            };
        },
        methods: {
            open(path,is_alarm) {
                this.$refs.SoundAndVisualizer.sound(path);
                this.isAlarm = is_alarm;
            },
            close: function() {
                this.$refs.SoundAndVisualizer.close();
                this.isOpen = false;
            }
        },
        components: {
            SoundAndVisualizer
        }
    };

</script>
<style lang="scss" scoped>
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
        opacity: 1;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px;
        height: 400px;
        width: 300px;
        border-radius: 5px;
        box-shadow: 0px 0px 10px #f00;
        background-color: white;
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
                border-radius: 18px;
                background-color: red;
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

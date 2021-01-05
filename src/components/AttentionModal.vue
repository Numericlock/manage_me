<template>
    <div>
        <transition name="fade">
            <div class="modal" v-if="isOpen" @click="close()"></div>
        </transition>
        <transition name="fade">
            <div class="modal-content" v-show="isOpen">
                <div class="text-wrapper">
                    <span>{{ this.text }}</span>
                </div>
                <div class="button-wrapper">
                    <button class="delete-button" @click="submit()">削除</button>
                    <button class="cancel-button" @click="close()">キャンセル</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: ['text'],
        data() {
            return {
                isOpen: false,
                id: null,
            }
        },
        methods: {
            submit() {
                console.log(this.id);
                this.$emit('submit',this.id);
                this.close();
            },
            open(id) {
                this.id=id;
                this.isOpen = true;
            },
            close: function() {
                this.isOpen = false;
            },
        }
    }
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
        justify-content: space-around;
        opacity: 1;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 30px;
        height: 200px;
        width: 300px;
        border-radius: 5px;
        box-shadow: 0px 0px 10px #f00;
        background-color: white;
        z-index: 11200;

        .button-wrapper {
            display: flex;
            justify-content: space-around;

            button {
                width: 100px;
                border: none;
                background: none;
                border-radius: 15px;
                border: 2px ridge black;
                height: 50px;
                font-weight: bold;
                font-size: 16px;
            }

            .cancel-button {}

            .cancel-button:hover {}

            .delete-button {
                background-color: red;
                color: white;

            }

            .delete-button:hover {}
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
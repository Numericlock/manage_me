<template>
    <div v-show="isOpen">
        <div class="modal-wrapper" @click="close">
            <ModalBackground transparency="0.1" zIndex="1100"/>
        </div>
        <div :class="['modal-content', {'dark': is_dark},{'light': !is_dark}]">
            <div class="text-wrapper">
                <span>{{ this.text }}</span>
            </div>
            <div class="button-wrapper">
                <button class="delete-button" @click="submit()">削除</button>
                <button class="cancel-button" @click="close()">キャンセル</button>
            </div>
        </div>
    </div>
</template>

<script>
    import ModalBackground from './ModalBackground'
    export default {
        props: {
            text:{
                default:"本当に削除しても良いですか？"
            },
            is_dark:{
                default:false
            },
        },
        components: {
            ModalBackground
        },
        data() {
            return {
                isOpen: false,
                id: null,
                display:false
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
            displayControl( bool ){
                this.display = bool;  
            },
        }
    }
</script>
<style lang="scss" scoped>
    div{
        .modal-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 30px;
            height: 200px;
            width: 300px;
            z-index: 1200;

            .button-wrapper {
                display: flex;
                justify-content: space-around;

                button {
                    width: 100px;
                    border: none;
                    height: 50px;
                    font-weight: bold;
                    font-size: 16px;
                    color:#383838;
                    fill:#383838;
                    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
                    backdrop-filter: blur( 4px );
                    -webkit-backdrop-filter: blur( 4px );
                    border-radius: 10px;
                    background: rgba( 255, 255, 255, 0.90 );
                    border: 1px solid rgba( 255, 255, 255, 0.18 );
                }

                .cancel-button {}

                .cancel-button:hover {}

                .delete-button {    
                    color:white;
                    background: rgba( 255, 0, 0, 0.90 );
                    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
                    backdrop-filter: blur( 4.5px );
                    -webkit-backdrop-filter: blur( 4.5px );
                    border-radius: 10px;
                }

                .delete-button:hover {}
            }
        }
    }

</style>
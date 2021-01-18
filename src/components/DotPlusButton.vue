<template>
    <div class="add-button">
        <button type="button" class="dotRadius" >
            <span class="plus"></span>
        </button>
    </div> 
</template>

<script>
    export default {
        data: function() {
            return {
                
            }
        },
        computed: {
            
        },
        methods: {
            
        }
    }
</script>

<style lang="scss">
    .add-button {
        display: flex;
        justify-content: center;
        flex-grow: 3;
        line-height: 90px;
        $button_size: 80px;

        .dotRadius {
            -webkit-appearance: button;
            -webkit-writing-mode: horizontal-tb !important;
            letter-spacing: normal;
            word-spacing: normal;
            box-sizing: border-box;
            margin: 0em;
            padding: 1px 6px;
            border-width: 2px;
            background: transparent;
            border: double 2px white;
            border-style: dashed;
            border-radius: 100%;
            width: $button_size;
            height: $button_size;
            color: white;
            position: relative;
            background: rgba( 62, 62, 62, 0.50 );
            box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
            backdrop-filter: blur( 5.0px );
            -webkit-backdrop-filter: blur( 5.0px );
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            -webkit-transition: -webkit-transform ease-out 200ms;
            transition: -webkit-transform ease-out 200ms;
            transition: transform ease-out 200ms;
            transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
            transition: border 100s, filter 0.6s;

            .plus {
                display: block;
                position: relative;
                background: white;
                width: 4px;
                height: $button_size/2;
                left: $button_size*0.37;
                top: 23.5%;
                border-radius: 20px;
                transition: background-color 0.3s,filter 0.6s;
            }

            .plus:before {
                content: "";
                position: absolute;
                background: white;
                top: 50%;
                left: ($button_size*-0.22);
                width: $button_size/2;
                height: 4px;
                margin-top: -2px;
                border-radius: 10px;
                transition: background-color 0.3s,filter 0.6s;
            }
        }

        .dotRadius:hover {
            border: solid 2px #fff;
            filter: drop-shadow(0 0 0.5rem white);
            color: white;
            transition: border 100s, filter 0.3s;

        }

        .dotRadius:focus {
            outline: none;
        }

        .dotRadius:hover>.plus {
            background: white;
            filter: drop-shadow(0 0 0.1rem white);
            transition: background-color 0.3s,filter 0.3s;

        }

        .dotRadius:hover>.plus:before {
            background: white;
            filter: drop-shadow(0 0 0.1rem white);
            transition: background-color 0.3s,filter 0.3s;

        }
    }
</style>
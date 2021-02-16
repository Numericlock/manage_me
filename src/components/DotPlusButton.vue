<template>
    <div class="plus-button">
        <button type="button" :class="['dot-radius', {'dark': isDark},{'light': !isDark},{'dark-dot-ring': !isDark}]" >
            <span class="plus"  :class="['plus', {'dark-background-color': !isDark}]"></span>
        </button>
    </div> 
</template>

<script>
    export default {
        props:{
            isDark:{
                default:false
            }
        },
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

<style lang="scss" >
    $darkColor:#383838;
    .dark{
        background: rgba( 62, 62, 62, 0.50 );
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 5.0px );
        -webkit-backdrop-filter: blur( 5.0px );
    }
    .dark-background-color{
        background:$darkColor !important;
    }
    .dark-background-color:before{
        background:$darkColor !important;
    }
    .dark-dot-ring{
        border: double 2px $darkColor !important;
        border-style: dashed !important;
    }
    .plus-button {
        display: flex;
        justify-content: center;
        flex-grow: 3;
        line-height: 90px;
        $button_size: 80px;

        .dot-radius {
            -webkit-appearance: button;
            -webkit-writing-mode: horizontal-tb !important;
            letter-spacing: normal;
            word-spacing: normal;
            box-sizing: border-box;
            margin: 0em;
            padding: 1px 6px;
            border-width: 2px;
            border: double 2px white !important;
            border-style: dashed !important;
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
            transition: border 100s, filter 0.6s;

            .plus {
                display: block;
                position: relative;
                background:white;
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

        .dot-radius:hover {
            border: solid 2px #fff;
            filter: drop-shadow(0 0 0.5rem white);
            transition: border 100s, filter 0.3s;

        }

        .dot-radius:focus {
            outline: none;
        }

        .dot-radius:hover>.plus {
            background: white;
            filter: drop-shadow(0 0 0.1rem white);
            transition: background-color 0.3s,filter 0.3s;

        }

        .dot-radius:hover>.plus:before {
            background: white;
            filter: drop-shadow(0 0 0.1rem white);
            transition: background-color 0.3s,filter 0.3s;

        }
    }
</style>
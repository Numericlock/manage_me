<template>
    <div :class="['tabbar', {'dark': isDark},{'light': !isDark}]">
        <router-link class="tabbar-icon-wrapper" to="/">
            <svg version="1.1" viewBox="0 0 512 512" 
                 :class="[{'carrent-page-icon': carrentPage == 'Home'}]">
                <g>
                    <path class="st0" d="M392.859,6.031L123.288,66.938l0.91,1.692l-0.782-0.51L0,256.273l26.488,17.374l4.457-6.804v139.261
                        l254.107,99.866l209.756-104.105V228.575L512,221.753L392.859,6.031z M270.335,466.165l-91.76-36.065V325.503l-62.872-18.629v98.51
                        l-53.085-20.866V218.561l78.208-119.232l120.232,221.945l3.856-1.519l5.421-2.147V466.165z M463.136,382.226l-164.858,81.829
                        V306.52l164.858-65.383V382.226z"></path>
                </g>
            </svg>
        </router-link>
        <router-link class="tabbar-icon-wrapper" to="/sounds">
            <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve"
                 :class="[{'carrent-page-icon': carrentPage == 'Sounds'}]">
                <g>
                    <path class="st0" d="M134.75,0v307.684c-14.347-2.241-29.784-1.552-45.222,3.303c-46.227,14.534-73.715,58.046-61.393,97.194
                        c12.307,39.063,59.771,58.996,105.984,44.462c35.443-11.144,62.887-39.349,66.822-69.478V117.602l219.68,41.776v202.82
                        c-14.06-2.068-29.154-1.35-44.218,3.403c-46.227,14.578-73.715,58.09-61.393,97.153c12.294,39.133,59.756,59.024,105.983,44.49
                        c36.751-11.575,63.361-41.504,65.816-72.898V60.676L134.75,0z"></path>
                </g>
            </svg>
        </router-link>
        <router-link class="tabbar-icon-wrapper" to="/setting">
            <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve"
                 :class="[{'carrent-page-icon': carrentPage == 'Setting'}]">
                <g>
                    <rect x="424" y="24" class="st0" width="48" height="52"></rect>
                    <rect x="424" y="188" class="st0" width="48" height="300"></rect>
                    <rect x="384" y="100" class="st0" width="128" height="64"></rect>
                    <rect x="231.985" y="24" class="st0" width="48" height="276.641"></rect>
                    <rect x="231.985" y="412.641" class="st0" width="48" height="75.359"></rect>
                    <rect x="191.985" y="324.641" class="st0" width="128" height="64"></rect>
                    <rect x="40" y="308" class="st0" width="48" height="180"></rect>
                    <rect x="40" y="24" class="st0" width="48" height="172"></rect>
                    <rect y="220" class="st0" width="128" height="64"></rect>
                </g>
            </svg>
        </router-link>
    </div>
</template>

<script>
    export default {
        props: [
          'carrentPage'
        ],
        data() {
            return {}
        },
        computed:{
            isDark:function(){
                return this.$store.state.isDark;
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
    .tabbar {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding:10px 0px;
        margin:20px 0px;
        .tabbar-icon-wrapper {
            line-height: 50px;
            svg {
                width: 40px;
                height: 40px;
                vertical-align: middle;
                transition: width 0.3s, height 0.3s, filter -0.3s;
            }
            svg:hover {
                filter: drop-shadow(0 0 0.5rem white);
                width:100px;
                height:50px;
                transition: width 0.3s, height 0.3s, filter -0.3s;
            }
        }   
    }
    .carrent-page-icon{
        filter: drop-shadow(0 0 0.5rem white);
    }
</style>

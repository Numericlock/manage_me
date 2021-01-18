<template>
    <div class="add-button">
        <button type="button" class="dotRadius" >
            <svg
               xmlns:dc="http://purl.org/dc/elements/1.1/"
               xmlns:cc="http://creativecommons.org/ns#"
               xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:svg="http://www.w3.org/2000/svg"
               xmlns="http://www.w3.org/2000/svg"
               xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
               xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
               version="1.1"
               id="_x32_"
               x="0px"
               y="0px"
               viewBox="0 0 512 512"
               xml:space="preserve"
               inkscape:version="1.0.1 (3bc2e813f5, 2020-09-07)"><metadata
               id="metadata34"><rdf:RDF><cc:Work
                   rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
                     rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs
               id="defs32" /><sodipodi:namedview
               pagecolor="#ffffff"
               bordercolor="#666666"
               borderopacity="1"
               objecttolerance="10"
               gridtolerance="10"
               guidetolerance="10"
               inkscape:pageopacity="0"
               inkscape:pageshadow="2"
               inkscape:window-width="1920"
               inkscape:window-height="1057"
               id="namedview30"
               showgrid="false"
               inkscape:zoom="1.4824219"
               inkscape:cx="119.39921"
               inkscape:cy="229.01713"
               inkscape:window-x="-8"
               inkscape:window-y="-8"
               inkscape:window-maximized="1"
               inkscape:current-layer="_x32_" />
            <g
               id="g27">
                <path
               class="st0"
               d="M327.392,89.817C270.288,62.244,222.046,0,222.046,0v41.456v325.214c-17.83-6.55-38.908-8.486-60.632-4.292   c-52.168,10.023-88.075,51.179-80.247,91.872c7.851,40.714,56.48,65.578,108.638,55.512c46.306-8.915,79.741-42.349,81.171-78.257   h0.29V148.513c149.815,18.303,125.209,124.349,114.842,155.439C472.464,207.23,427.556,138.158,327.392,89.817z"
               id="path25" />
            </g>
            <path
               d="m 472.8939,395.93551 h -79.16666 v -79.16665 h -31.66669 v 79.16665 H 282.8939 v 31.66668 h 79.16665 v 79.16667 h 31.66669 v -79.16667 h 79.16666 z"
               id="path1755" />
            </svg>
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
        position: relative;
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

            svg {
                display: block;
                position: relative;
                fill:white;
                width:50px;
                height:50px;
                left:5px;
                top:-2px;
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

        .dotRadius:hover>.svg {
            background: white;
            filter: drop-shadow(0 0 0.1rem white);
            transition: background-color 0.3s,filter 0.3s;

        }

    }
</style>
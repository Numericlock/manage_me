<template>
    <tr>
        <td>Reol</td>
        <td>ダリ</td>
        <td>金字塔</td>
        <td class="td-button">
            <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                <g>
                    <path class="st0" d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"></path>
                </g>
            </svg>
            <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                <g>
                    <path class="st0" d="M256.004,0c-141.166,0-256,114.841-256,256s114.834,256,256,256c141.151,0,255.992-114.841,255.992-256
S397.155,0,256.004,0z M256.004,466.046C140.001,466.046,45.95,372.002,45.95,256c0-116.002,94.051-210.046,210.054-210.046
c115.995,0,210.039,94.045,210.039,210.046C466.043,372.002,371.999,466.046,256.004,466.046z"></path>
                    <rect x="177.23" y="190.36" class="st0" width="52.514" height="131.28"></rect>
                    <rect x="282.257" y="190.36" class="st0" width="52.506" height="131.28"></rect>
                </g>
            </svg>
        </td>
        <td class="td-button">
            <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve">
                <g>
                    <polygon class="st0" points="367.375,183.607 312.486,238.495 257.592,183.607 240.087,201.105 294.982,256 240.087,310.894 
257.592,328.393 312.486,273.498 367.375,328.393 384.88,310.894 329.985,256 384.88,201.105 	"></polygon>
                    <path class="st0" d="M448.376,60.557h-251.76c-23.23,0-45.327,10.07-60.573,27.608L7.448,236.082C2.5,241.76-0.007,248.92,0,256
c-0.007,7.08,2.5,14.234,7.448,19.918l128.596,147.931c15.252,17.532,37.342,27.594,60.573,27.594h251.76
c35.144-0.014,63.617-28.48,63.624-63.624V124.187C511.993,89.036,483.52,60.563,448.376,60.557z M484.539,387.819
c-0.007,10.03-4.03,18.98-10.593,25.57c-6.591,6.564-15.541,10.579-25.57,10.593h-251.76c-15.286,0-29.82-6.624-39.85-18.155
L28.178,257.904c-0.496-0.577-0.711-1.2-0.718-1.904c0.006-0.704,0.221-1.327,0.71-1.891l128.602-147.923
c10.03-11.545,24.564-18.168,39.844-18.168h251.76c10.03,0.007,18.98,4.022,25.57,10.593c6.563,6.583,10.586,15.54,10.593,25.576
V387.819z"></path>
                </g>
            </svg>
        </td>
    </tr>
</template>

<script>
    const app = window.app;
    const fs = window.fs;
    export default {
        props: {
            name: String, //追加
            path: String //追加
        },
        data () {
            return {
                source: null
            }
        },
        components: {
        },
        methods:{
            sound_start:function(){
                //console.log(this);
                //console.log(this.path);
                var source = this.source;
                var path = this.path.replace(app.getPath('music'), '');
                console.log(path);
                const textfile = fs.readFileSync(app.getPath('music')+path, (err, data) => {
                if (err) throw err;
                    console.log(data);
                });
                var toArrayBuffer = function(buf){    
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                }
               // console.log(textfile);
                var audioContext = new AudioContext;
                // var fileReader   = new FileReader;
                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 128;
                analyser.connect(audioContext.destination);
                audioContext.decodeAudioData(toArrayBuffer(textfile), function(buffer){
                    if(this.source) {
                        this.source.stop();
                    }
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = buffer;
                    this.source.connect(analyser);
                    this.source.start(0);
                });
                this.source = source;
            },
            sound_stop:function(){
               // var source = this.source;
                console.log(this.source);
                this.source.stop();
            }
        }
    }
</script>

<style>
    
</style>
<template>
    <div class="sound"><span class="sound-name">{{ name }}</span><span v-on:click="sound_start" class="start">再生</span><span v-on:click="sound_stop" class="stop">stop</span><span class="delete">delete</span></div>
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
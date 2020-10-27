<template>
    <div>
        <transition name="fade">
            <div class="modal" v-if="isOpen"></div>
        </transition>
        <transition name="fade">
            <div class="modal-content" v-show="isOpen">
                <div><span>{{ title }}</span></div>
                <div><span>{{ time }}</span></div>
                <div><span>{{ sound_path }}</span></div>
                <div><span>{{ sound_title }}</span></div>
                <div><span>{{ sound_artist }}</span></div>
                <canvas id="visualizer" ref="visualizer" :style="src" height="255"></canvas>
                <div>
                    <button class="close-button" @click="close()">STOP</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    const fs = window.fs;
    const mm = require('music-metadata-browser');
//const util = require('util');
    var source, animationId;
    export default {
        name: "Modal",
        props: ['title','time','sound_path', 'sound_name'],
        data: function() {
            return {
                isOpen: false,
                source: null,
                src:null,
                sound_title:null,
                sound_artist:null
            };
        },
        methods: {
            open (path) {
                this.isOpen = true;
                this.sound(path);
            },
            close: function() {
                console.log(source);
                if (source) {
                    source.stop();
                }
                this.isOpen = false;
            },
            sound (path) {
                var audioContext = new AudioContext;
                var canvas = this.$refs.visualizer;
                var canvasContext = canvas.getContext('2d');
                canvasContext.transform(1, 0, 0, -1, 0, 255);
                //var calum = this.sound_docs.filter((v) => v._id==id);
                // var path = calum[0].path.replace(app.getPath('music'), '');
                const textfile = fs.readFileSync(path, (err, data) => {
                    if (err) throw err;
                    console.log(data);
                });
                // const textfile = fs.readFileSync(app.getPath('music')+path, (err, data) => {
                // if (err) throw err;
                //     console.log(data);
                // });
                var blob = new Blob([textfile]);

                mm.parseBlob(blob).then(metadata => {
                    console.log(metadata);
                    console.log(metadata.common.picture[0].data);
                    var j = btoa(String.fromCharCode(...metadata.common.picture[0].data));
                    this.src = "background-image:url(data:;base64,"+j+")";
                    this.sound_title = metadata.common.title;
                    this.sound_artist = metadata.common.artist;
                  });
                var toArrayBuffer = function(buf) {
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                }
                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.connect(audioContext.destination);
                
                audioContext.decodeAudioData(toArrayBuffer(textfile), function(buffer) {
                    if (source) {
                        source.stop();
                        cancelAnimationFrame(animationId);
                    }

                    source = audioContext.createBufferSource();

                    source.buffer = buffer;
                    source.loop = true;
                    source.connect(analyser);
                    source.start(0);

                    animationId = requestAnimationFrame(render);
                });

                var render = function() {
                    var spectrums = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(spectrums);

                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    for (var i = 0, len = spectrums.length; i < len; i++) {
                        canvasContext.fillRect(i * 10, 0, 5, spectrums[i]/2);
                        canvasContext.fillStyle = "orange";
                    }

                    animationId = requestAnimationFrame(render);
                };
            }
        },
        watch: {


        }
    };
</script>
<style lang="scss">
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
        canvas{
           background-size:cover;
            border-radius: 15px;
        }
        div{
            
            .close-button{
                background: none;
                border: none;
                vertical-align: middle;
                width: 150px;
                height:50px;
                margin:15px;
                font-size:30px;
                font-weight: bold;
                border-radius: 18px;
                background-color:red;
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
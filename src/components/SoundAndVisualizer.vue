<template>
    <div class="visualizer-wrapper">
        <div class="canvas-wrapper">
            <transition-group name="fade" :enter-active-class="'animate__animated animate__fadeIn'" :leave-active-class="'animate__animated animate__fadeOut'">
                <div v-show="loading" class="black-grass" key="grass"></div>
                <LoadingAnimation v-show="loading" :RectangleQuantity="8" :height="55" key="loader" />
            </transition-group>
            <canvas id="visualizer" ref="visualizer" :style="src"></canvas>
        </div>
        <div>
            <span>{{ sound_artist }}</span><span class="sound-title">{{ sound_title }}</span>
        </div>
        <div v-if="hide_playback_button==false">
            <div :class="['playback' ,{'pause': playbackNow}]" @click="suspend()"></div>
        </div>
    </div>
</template>

<script>
    import LoadingAnimation from './LoadingAnimation/LoadingAnimation.vue'
    const fs = window.fs;
    const mm = require('music-metadata-browser');
    var default_sounds = require('./sounds/default.js');
    var source, animationId;
    var audioContext;
    export default {
        components: {
            LoadingAnimation
        },
        props: {
            hide_playback_button: {
                default: false,
            }
        },
        data: function() {
            return {
                loading: false,
                src: null,
                sound_title: null,
                sound_artist: null,
                playbackNow: false
            };
        },
        methods: {
            playback_toggle() {
                if (this.playbackNow) this.playbackNow = false;
                else this.playbackNow = true;
            },

            close() { //音声再生終了
                if (source) {
                    source.stop();
                }
            },
            kill() { //音声再生強制終了
                this.close();
                audioContext = null;
            },
            suspend() { //音声一時停止再開
                if (audioContext) {
                    if (audioContext.state === 'running') {
                        audioContext.suspend().then(function() {
                            this.playbackNow = false;
                        }.bind(this));
                    } else if (audioContext.state === 'suspended') {
                        audioContext.resume().then(function() {
                            this.playbackNow = true;
                        }.bind(this));
                    }
                }
            },
            async sound(path) {
                this.loading = true;
                audioContext = new AudioContext;
                var canvas = this.$refs.visualizer;
                var canvasContext = canvas.getContext('2d');
                canvasContext.transform(1, 0, 0, -1, 0, 150);
                var textfile;
                let arrayBuffer

                if (path) {
                    textfile = fs.readFileSync(path, (err) => {
                        if (err) throw err;
                    });
                    arrayBuffer = toArrayBuffer(textfile);
                    setMusicBasicInfo(textfile);
                } else {
                    textfile = default_sounds;
                    arrayBuffer = base64ToArrayBuffer(textfile);
                }
                function setMusicBasicInfo(data){
                    var blob = new Blob([data]);
                    mm.parseBlob(blob).then(metadata => {
                        if (metadata.common.picture) {
                            var j = btoa(String.fromCharCode(...metadata.common.picture[0].data));
                            this.src = "background-image:url(data:;base64," + j + ")";
                            this.sound_title = metadata.common.title;
                            this.sound_artist = metadata.common.artist;
                        }
                    });
                }
                function toArrayBuffer(buf) {
                    let result;
                    try {
                        result = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                    } catch {
                        result = buf;
                    }
                    return result
                }

                function base64ToArrayBuffer(base64) { //base64をArrayBufferヘエンコードする関数
                    var binary_string = window.atob(base64);
                    var len = binary_string.length;
                    var bytes = new Uint8Array(len);
                    for (var i = 0; i < len; i++) {
                        bytes[i] = binary_string.charCodeAt(i);
                    }
                    return bytes.buffer;
                }

                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.connect(audioContext.destination);
                audioContext.decodeAudioData(arrayBuffer, function(buffer) {
                    if (source) {
                        source.stop();
                        cancelAnimationFrame(animationId);
                    }
                    if (audioContext) {
                        source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.loop = true;
                        source.connect(analyser);
                        source.start(0);
                        this.loading = false;
                        this.playbackNow = true;
                    } else {
                        this.loading = false;
                    }
                    animationId = requestAnimationFrame(render);
                }.bind(this));


                var render = function() {
                    var spectrums = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(spectrums);

                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    for (var i = 0, len = spectrums.length; i < len; i++) {
                        canvasContext.fillRect(i * 10, 0, 5, spectrums[i] / 2);
                        canvasContext.fillStyle = "#fff";
                    }

                    animationId = requestAnimationFrame(render);
                };
            }
        }
    }

</script>

<style lang="scss">
    .visualizer-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .canvas-wrapper {
            position: relative;
            border-radius: 15px;

            canvas {
                background-size: cover;
                background-repeat: no-repeat;
                border-radius: 15px;
                background-image: url('../../public/img/default1.png');
                height: 255px;
                width: 255px;
            }

            .black-grass {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                border-radius: 15px;
                transform: translate(-50%, -50%);
                background: rgba(62, 62, 62, 0.50);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                backdrop-filter: blur(5.0px);
                -webkit-backdrop-filter: blur(5.0px);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.18);
            }
        }

        .sound-title {}

        div {

            .playback {
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-left: 30px solid #6aa7cd;
                border-radius: 5px;
                transition: border-left 0.1s, border-right 0.1s;
            }

            .pause {
                border-left: 10px solid #6aa7cd;
                border-right: 10px solid #6aa7cd;
                border-top: 0px solid transparent;
                border-bottom: 0px solid transparent;
                border-radius: 0px;
                height: 30px;
                width: 15px;
                transition: border-left 0.1s, border-right 0.1s;
            }
        }
    }

</style>

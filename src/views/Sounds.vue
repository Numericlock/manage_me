<template>
    <div class="sounds-setting-wrapper">
        <div class="title">
            <span>Sounds</span>
        </div>
        <div class="settings">
            <div class="input-wrapper">
                <label>
                    Add sound
                </label>
                <div class="sound-input">
                    <div class="uploadButton">
                        ファイルを選択
                        <input type="file" id="file" onchange="uv.style.display='inline-block'; uv.value = this.value;" v-on:change="file_out" />
                        <input type="text" id="uv" class="uploadValue" disabled />
                    </div>
                    <button v-on:click="sound_register">追加</button>
                </div>
            </div>
        </div>
        <!--<div class="sounds-wrapper" id="sounds-wrapper">
            <div v-for="(sound, key) in sound_docs" :key="key" class="sound"><span class="sound-name">{{ sound.name }}</span><span v-on:click="sound_start(sound._id)" class="start">再生</span><span v-on:click="sound_stop" class="stop">stop</span><span class="delete">delete</span></div>
        </div>-->
        <div class="sounds-wrapper" id="sounds-wrapper">
            <table>
                <tr>
                    <th>Artist</th>
                    <th>title</th>
                    <th>album</th>
                </tr>
                <tr v-for="(sound, key) in sound_docs" :key="key">
                    <td>{{ sound.artist }}</td>
                    <td>{{ sound.name }}</td>
                    <td>{{ sound.album }}</td>
                    <td class="td-button">
                        <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" @click = "sound_music_on_modal(sound.path)">
                            <g>
                                <path class="st0" d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
		C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
		c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
		l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"></path>
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
            </table>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue/dist/vue.esm.js';
    import sound from '../components/sound.vue';
    const app = window.app;
    var Datastore = require('nedb');
    var path = require('path');
    const fs = window.fs;
    const db = new Datastore({
        filename: path.join(app.getPath('userData'), '/alarm.db'),
        //  filename: '../data.db',
        autoload: true
    });
    const mm = require('music-metadata-browser');
    export default {
        name: 'Setting',
        data() {
            return {
                toggleText: "OFF",
                file_name: null,
                file_path: null,
                sound_docs: [],
                source: null
            }
        },
        methods: {
            toggle: function() {
                if (this.toggleText == "OFF") {
                    this.toggleText = "ON";
                } else {
                    this.toggleText = "OFF";
                }
            },
            file_out: function(e) {
                const files = e.target.files || e.dataTransfer.files;
                this.file_name = files[0].name;
                this.file_path = files[0].path;
                // fileReader.readAsArrayBuffer(e.target.files[0]);
            },
            sound_music_on_modal(path){
                console.log("modalmodal"+path);
                this.$emit('openModal',path);
            },
            sound_register: function() {
                if (this.file_path) {
                    var type = "sound";
                    const textfile = fs.readFileSync(this.file_path, (err) => {
                        if (err) throw err;
                    });
                    var title;
                    //var src;
                    var artist;
                    var album;
                    var blob = new Blob([textfile]);
                    mm.parseBlob(blob).then(metadata => {
                        //  var j = btoa(String.fromCharCode(...metadata.common.picture[0].data));
                        // src = "background-image:url(data:;base64," + j + ")";
                        console.log(metadata);
                        title = metadata.common.title;
                        artist = metadata.common.artist;
                        album = metadata.common.album;
                        var dbData = {
                            "name": title,
                            "artist": artist,
                            "album": album,
                            "type": type,
                            "path": this.file_path
                        };
                        db.insert(dbData, (error, newDoc) => {
                            if (error !== null) console.error(error);
                            console.log(newDoc);
                        });
                        // artist = metadata.common.artist;
                    });
                }
            },
            appendBox(name, path) {
                var ComponentClass = Vue.extend(sound);
                var instance = new ComponentClass({
                    propsData: {
                        name: name,
                        path: path
                    }
                });

                // console.log(sound);
                instance.$mount();
                //console.log(instance.$el);
                document.getElementById('sounds-wrapper').appendChild(instance.$el)
            },
            getData: function() {
                //var sounds = this;
                var sound_docs = null;
                //db.remove({type:"sound"}, { multi: true });
                db.find({
                    type: "sound"
                }, function(err, docs) {
                    //for (var i = 0; i < docs.length; i++) {
                    //    sounds.appendBox(docs[i].name, docs[i].path);
                    //}
                    sound_docs = docs;
                    this.sound_docs = sound_docs;
                }.bind(this));
                this.sound_docs = sound_docs;
            },
            sound_start(id) {
                var calum = this.sound_docs.filter((v) => v._id == id);
                var path = calum[0].path.replace(app.getPath('music'), '');
                const textfile = fs.readFileSync(app.getPath('music') + path, (err, data) => {
                    if (err) throw err;
                    console.log(data);
                });
                var toArrayBuffer = function(buf) {
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                }
                // console.log(textfile);
                var audioContext = new AudioContext;
                // var fileReader   = new FileReader;
                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 128;
                analyser.connect(audioContext.destination);
                audioContext.decodeAudioData(toArrayBuffer(textfile), function(buffer) {
                    if (this.source) {
                        this.source.stop();
                    }
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = buffer;
                    this.source.connect(analyser);
                    this.source.start(0);
                }.bind(this));
            },
            sound_stop: function() {
                this.source.stop();
            }
        },
        mounted() {
            this.getData();
            this.$emit('nextAlarm');
        }
    }

</script>
<style lang="scss">
    .sounds-setting-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;

        .title {
            display: flex;
            justify-content: center;
            height: 35px;
            font-size: 30px;
            padding-top: 10px;
        }

        .settings {
            display: flex;
            flex-direction: column;
            flex-grow: 5;
            padding: 0px 20px;

            .input-wrapper {
                display: flex;

                min-height: 50px;
                margin-bottom: 10px;

                label {

                    min-width: 30%;
                    width: 30%;
                    line-height: 50px;

                }

                .sound-input {
                    width: 60%;
                    display: flex;

                    .uploadButton {
                        display: inline-block;
                        position: relative;
                        overflow: hidden;
                        border-top-left-radius: 3px;
                        border-bottom-left-radius: 3px;
                        background: #099;
                        color: #fff;
                        text-align: center;
                        padding: 10px;
                        line-height: 30px;
                        width: 180px;
                        cursor: pointer;

                        input[type=file] {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            cursor: pointer;
                            opacity: 0;
                        }

                        .uploadValue {
                            display: none;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 3px;
                            padding: 3px;
                            color: #ffffff;
                        }
                    }

                    .uploadButton:hover {
                        background: #0aa;
                    }

                    button {
                        background: none;
                        background: #099;
                        color: #fff;
                        font-weight: bold;
                        font-size: 15px;
                        border: none;
                        border-top-right-radius: 3px;
                        border-bottom-right-radius: 3px;
                        height: 100%;
                        padding: 10px 15px;
                    }

                    button:focus {
                        outline: none;
                    }

                    button:hover {
                        background: #0aa;
                    }
                }

                .block {
                    padding-left: 90px;
                    width: 40%;
                    position: relative;
                    clear: both;
                    float: left;
                    line-height: 50px;

                    input {
                        display: none;
                    }

                    span {
                        text-transform: uppercase;
                        font-weight: bold;
                        letter-spacing: 1px;
                        font-size: 15px;
                        margin-left: 10px;
                    }

                    label {
                        width: 50px;
                        min-width: 50px;
                        height: 30px;
                        margin-top: 10px;
                        box-sizing: border-box;
                        border: 3px solid;
                        float: left;
                        border-radius: 100px;
                        position: relative;
                        cursor: pointer;
                        transition: .3s ease;
                    }

                    input[type=checkbox]:checked+label {
                        background: #55e868;
                    }

                    input[type=checkbox]:checked+label:before {
                        left: 23px;
                    }

                    label:before {
                        transition: .3s ease;
                        content: '';
                        width: 20px;
                        height: 20px;
                        position: absolute;
                        background: white;
                        left: 2px;
                        top: 2px;
                        box-sizing: border-box;
                        border: 3px solid;
                        color: black;
                        border-radius: 100px;
                    }
                }
            }
        }

        .sounds-wrapper {
            flex-direction: column;
            height: 100%;
            width: 100%;
            overflow-y: auto;
            color: white;

            .sound {
                display: flex;
                justify-content: space-between;
                background-color: #099;
                padding: 3px 10px;
                border-radius: 7px;
                margin-bottom: 3px;

                .sound-name {
                    text-align: left;
                }

                .delete {}
            }

            .sound:hover {
                background-color: #0aa;
            }
        }

        .sounds-wrapper::-webkit-scrollbar {
            width: 10px;
        }

        /*スクロールバーの背景色・角丸指定*/
        .sounds-wrapper::-webkit-scrollbar-track {
            border-radius: 10px;
            background: #f2f2f2;
        }

        /*スクロールバーの色・角丸指定*/
        .sounds-wrapper::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: #09C9D9;
        }

        table {
            color: black;
            width: 100%;

            th {
                text-align: left;
                border-left: 1px solid #0aa;
            }

            td {
                border-left: 1px solid #0aa;
            }

            .td-button {
                width: 30px;
                border-left: none;
            }
        }
    }

</style>

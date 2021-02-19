<template>
    <div class="sounds-setting-wrapper">
        <div class="add-button-wrapper">
            <div @click="beginFileInput">
                <DotSoundAddButton :isDark="isDark"/>
                <input type="file" id="file" onchange="uv.style.display='inline-block'; uv.value = this.value;" v-on:change="fileOut" />
            </div>
        </div>
        <div :class="['SoundAndVisualizer-wrapper', {'dark': isDark},{'light': !isDark}]">
            <SoundAndVisualizer ref="SoundAndVisualizer" />
        </div>
        <div :class="['table-wrapper', {'dark': isDark},{'light': !isDark}]">
            <table>
                <tr>
                    <th>Artist</th>
                    <th>title</th>
                    <th>album</th>
                </tr>
                <tr v-for="(sound, key) in soundDocs" :key="key">
                    <td>{{ sound.artist }}</td>
                    <td>{{ sound.name }}</td>
                    <td>{{ sound.album }}</td>
                    <td class="td-button">
                        <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" @click = "open(sound.path)">
                            <g>
                                <path class="st0" d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
        C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
        c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
        l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"></path>
                            </g>
                        </svg>
                    </td>
                    <td class="td-button">
                        <svg version="1.1" viewBox="0 0 512 512" xml:space="preserve" @click = "modalOpen(sound._id)">
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
        <AttentionModal @submit='soundDelete' ref="AttentionModal" v-bind:text="text"/>
    </div>
</template>
<script lang="ts">
    import Vue from "vue"
    import SoundAndVisualizer from '../components/SoundAndVisualizer.vue'
    import AttentionModal from '../components/AttentionModal.vue'
    import DotSoundAddButton from '../components/DotSoundAddButton.vue'
    const app = window.app;
    const fs = window.fs;
    import db from '../datastore'
    import mm from 'music-metadata-browser';
    export type DataType = {
        toggleText: string;
        fileName: string;
        filePath: string;
        soundDocs: string[];
        source: string;
        text: string;
    }
    export default Vue.extend({
        name: 'Sounds',
        components: {
            AttentionModal,
            DotSoundAddButton,
            SoundAndVisualizer
        },
        data(): DataType {
            return {
                toggleText: "OFF",
                fileName: '',
                filePath: '',
                soundDocs: [],
                source: null,
                text:"削除してもいいの？"
            }
        },
        computed:{
            isDark(): void{
                return this.$store.state.isDark;
            }  
        },
        methods: {
            toggle(): void {
                if (this.toggleText == "OFF") this.toggleText = "ON";
                else this.toggleText = "OFF";
            },
            fileOut(e: any): void {
                const files = e.target.files || e.dataTransfer.files;
                this.fileName = files[0].name;
                this.filePath = files[0].path;
                // fileReader.readAsArrayBuffer(e.target.files[0]);
                this.soundRegister();
            },
            beginFileInput(): void{
                    document.getElementById("file").click();
            },
            soundMusicOnModal(path): void{
                this.$emit('openModal',path);
            },
            open(path): void{
                this.$refs.SoundAndVisualizer.sound(path);
            },
            close(): void{
                this.$refs.SoundAndVisualizer.kill();
            },
            soundRegister(): void{
                if (this.filePath) {
                    const type = "sound";
                    const textfile = fs.readFileSync(this.filePath, (err) => {
                        if (err) throw err;
                    });
                    let title;
                    let artist;
                    let album;
                    const blob = new Blob([textfile]);
                    mm.parseBlob(blob).then(metadata => {
                        title = metadata.common.title;
                        artist = metadata.common.artist;
                        album = metadata.common.album;
                        const dbData = {
                            "name": title,
                            "artist": artist,
                            "album": album,
                            "type": type,
                            "path": this.filePath,
                        };
                        db.insert(dbData, (error) => {
                            if (error !== null) console.error(error);
                            this.getData();
                        });
                    });
                }
            },
            soundDelete(...args): void{
                db.loadDatabase((error) => {
                    if (error !== null) console.error(error);
                    const id = args[0];
                    db.update({
                        soundId: id
                    },{
                        $set: {
                            "soundId": null
                        }
                    },{
                        multi: true 
                    },function(err) {
                        if (err !== null) console.error(err);
                    }.bind(this));
                    db.find({
                        type: "alarm"
                    },function(err) {
                         if (err !== null) console.error(err);
                    }.bind(this));
                    db.remove({
                        _id: id
                    }, {
                        multi: true
                    }, function(err) {
                         if (err !== null) console.error(err);
                        this.getData();
                    }.bind(this));
                });
            },
            modalOpen(id): void{
                this.$refs.AttentionModal.open(id);  
            },
            getData(): void{
                let soundDocs = null;
                //db.remove({type:"sound"}, { multi: true });
                db.find({
                    type: "sound"
                }, function(err, docs) {
                    soundDocs = docs;
                    this.soundDocs = soundDocs;
                }.bind(this));
                this.soundDocs = soundDocs;
            },
            soundStart(id): void{
                const calum = this.soundDocs.filter((v) => v._id == id);
                const path = calum[0].path.replace(app.getPath('music'), '');
                const textfile = fs.readFileSync(app.getPath('music') + path, (err) => {
                    if (err) throw err;
                });
                const toArrayBuffer = function(buf) {
                    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                }
                const audioContext = new AudioContext;
                const analyser = audioContext.createAnalyser();
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
            soundStop(): void{
                this.source.stop();
            }
        },
        mounted(): void {
            this.getData();
            this.$emit('nextAlarm');
        }
    })

</script>
<style lang="scss">
    .add-button-wrapper{
        position: absolute;
        top:15px;
        left:15px;
        div{
            position: relative;
            input[type=file] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display:none;
                border-radius:100%;

            }   
        }
    }
    .sounds-setting-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 20px 12px;
        align-items:center;
        .SoundAndVisualizer-wrapper{
            padding:10px 25px 10px;
            width:250px;
        }
        .table-wrapper{
            padding:10px 25px 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items:center;
            overflow-y: auto;
            overflow-x: hidden;
            padding:10px;
            width:100%;
            height:150px;
            margin:15px 0;
            table {
                width:100%;
                th {
                    text-align: left;
                    border-left: 1px solid #0aa;
                    padding-left:8px;
 border-bottom: 1px solid rgba( 255, 255, 255, 0.18 );
                }
                td {
                    border-left: 1px solid #0aa;
                    padding-left:8px;
                     border-bottom: 1px solid rgba( 255, 255, 255, 0.18 );
                }
                .td-button {
                    width: 30px;
                    border-left: none;
                }
            }
        }
        /*スクロールバーの横幅指定*/
        .table-wrapper::-webkit-scrollbar {
            width: 10px;
        }

        /*スクロールバーの背景色・角丸指定*/
        .table-wrapper::-webkit-scrollbar-track {
            border-radius: 10px;
            background: #f2f2f2;
        }

        /*スクロールバーの色・角丸指定*/
        .table-wrapper::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: rgba( 62, 62, 62, 0.50 );
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
    }

</style>

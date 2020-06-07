<template>
<div class="parent">
    <modal v-if="modal.show" @close="modal.show = false">
        <h3 slot="header">{{modal.header}}</h3>
        <h4 slot="body">{{modal.text}}</h4>
    </modal>
    <div class="image-preview__wrapper">
        <div v-if="image.activeURL" class="image-preview__image">
            <div class="text-in-corner" @click="removeImage">Select new image</div>
            <img :src="image.activeURL" ref="referenceImage">
        </div>
        <div 
            v-show="!image.activeURL"
            :class="['image-preview__dropzone']" 
            ref="dropzone"
            v-cloak
            @drop.prevent="addFile"
            @dragover.prevent="setDragStyle"
            @dragleave="unsetDragStyle"
            @dragend="unsetDragStyle"
            @click="openImageSelector"
        >    
            <div class="text-in-corner">Upload image</div>
        </div>
    </div>
    
    <div class="webcam__wrapper">
    <div class="text-in-corner z-index-10" >Your webcam</div>
        <div class="webcam__video-wrapper">
            <transition name="disclaimer">
                <div class="webcam__disclaimer-wrapper" v-if="isDisclaimer">
                    <div class="webcam__disclaimer">
                        <h2>Disclaimer</h2>
                        <h3>VerifyAI accesses your device camera and uses AI algorithms to analyse your video stream. VerifyAI DO NOT transmit, store or share your data as all AI computations are carried out on your local machine ONLY. We respect your privacy.</h3>
                    </div>
                </div>
            </transition>
            <video v-show="!isDisclaimer" class="webcam__video" @loadedmetadata="onPlay()" ref="video" id="inputVideo" autoplay/>
            <canvas v-show="!isDisclaimer" ref="overlay" class="webcam__canvas"/>
        </div>
    </div>

    <div class="system-logs__wrapper">
        <div class="text-in-corner" @click="addCount(0)">System logs</div>
        <div class="system-logs__list">
            <div v-for="log of preparedLogs">
                <span :class="[log.disabled ? 'system-logs__log_disabled':'', 'system-logs__log']">{{log.text}}</span>
            </div>
        </div>
    </div>
    <div class="manifest__wrapper">
        <div class="text-in-corner">About</div>
        <div class="manifest__github"> 
        <a  href="https://github.com/helenanikonole/MV_check" target="_blank">
            <img title="Github repository" src="~/assets/images/logo.png"/>
        </a>
        </div>
    </div>
</div>
</template>
<script>
import { base64ToBlob, blobToBase64 } from 'base64-blob'
import { mapActions, mapMutations } from 'vuex'
import * as faceapi from 'face-api.js'

export default {
    data(){
        return {
            image: {
                base64: null,
                activeURL: null,
            },
            isDisclaimer: true,
            modal: {
                show: false,
                header: 'Default header',
                text: 'Check console output',
            },
            logs: [
                {
                    id: 0,
                    template: '- Webcam (recognized by _count_/_models_ models)',
                    count: -1,
                    models: 2,
                    disabled: false, 
                },
                {
                    id: 1,
                    template: '- Street CCTV (_count_/_models_ models)',
                    count: 0,
                    models: 0,
                    disabled: true,
                },
                {
                    id: 2,
                    template: '- Public transport CCTV (_count_/_models_ models)',
                    count: 0,
                    models: 0,
                    disabled: true,
                },
                {
                    id: 3,
                    template: '- Security CCTV (_count_/_models_ models)',
                    count: 0,
                    models: 0,
                    disabled: true,
                }
            ]
        }
    },
    watch: {
        logs: {
            deep: true,
            handler(newValue){
                let res = newValue.find(el => el.count > 0)
                
                if(res) {
                    //Действие про распознование
                }
            }
            
        }
    },
    computed: {
        preparedLogs() {
            let prepared = []

            for(let log of this.logs) {
                prepared.push({
                    ...log,
                    text: log.template.replace("_count_", log.count).replace("_models_", log.models)
                })
            }

            return prepared
        }
    },
    mounted() {
        const context = this
        //Показать дисклеймер
        
        Promise.all([
            context.init(),
            faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
            faceapi.nets.faceExpressionNet.loadFromUri('./models')
        ]).catch(err => {
            console.log(err)
        })
        
  },
  methods: { 
        ...mapActions({
            validateImage: 'utils/validateImage',
        }),
        init() {
            const context = this
            //Показать дисклеймер
            context.showDisclaimer()
            
            return new Promise ((resovle, reject) => {
                //Если 
                context.startVideo().then(() => {
                    setTimeout(context.hideDisclaimer, 5000)
                }).catch(() => {
                    setTimeout( function () {
                        context.openModal('Error', 'Enable camera to continue.')
                    }, 5000)
                    
                    return reject()
                })
            })
        },
        showDisclaimer() {
            this.isDisclaimer = true
        },
        hideDisclaimer() {
            this.isDisclaimer = false
        },
        tryAgain() {
            //Действия необходимые при запуске сервиса снова
            for(let index in this.logs) {
                this.logs[index].count = 0
            }
        },
        resetCounter(id) {
            const context = this
            
            context.logs.find((log, index) => {
                if(log.id == id) {
                    context.logs[index].count = 0
                }
            }) 
        },
        addCount(id) {
            const context = this
            
            context.logs.find((log, index) => {
                if(log.id == id) {
                    context.logs[index].count++
                }
            }) 
        },
        openModal(header, text) {
            this.modal.show = true
            this.modal.header = header || 'Default heder'
            this.modal.text = text || 'Check console output'  
        },
        onPlay() {
            const videoEl = this.$refs.video;
            const context = this;
            let inputSize = 512
            let scoreThreshold = 0.5
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })

            faceapi
            .detectSingleFace(videoEl, options)
            .withFaceLandmarks()
            .withFaceDescriptor()
            .then(result => {

                if(result) {
                    if(context.image.activeURL) {
                        const referenceImage = context.$refs.referenceImage;

                        faceapi.detectSingleFace(referenceImage, options)
                            .withFaceLandmarks()
                            .withFaceDescriptor()
                            .then(refResult => {
                                if (refResult) {
                                    const faceMatcher = new faceapi.FaceMatcher(result)
                                    const bestMatch = faceMatcher.findBestMatch(refResult.descriptor)
                                    
                                    if(bestMatch._label != 'unknown') {
                                        const canvas = this.$refs.overlay;
                                        const dims = faceapi.matchDimensions(canvas, videoEl, true)
                                        faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims))

                                        console.log(bestMatch)
                                    }
                                }
                            })
                    }

                }
                setTimeout(() => { this.onPlay() })
            })
        },
        startVideo() {
            const context = this
            const video = context.$refs.video
            return new Promise ((resolve, reject) => {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia
            
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({ video: {} }, 
                    (stream) => {
                        video.srcObject = stream
                        context.$refs.overlay.width = context.$refs.video.offsetWidth
                        context.$refs.overlay.height = context.$refs.video.offsetHeight
                        resolve(stream)
                    }, (error) => {
                        return reject(error)
                    })

                } else {
                    return reject(error)
                }
            })
        },
        openImageSelector() {
            const input = document.createElement('input')
                , context = this

            input.type = 'file'
            input.accept='image/*'
            input.onchange = event => {
                const file = event.target.files[0]
                context.validateImage(file).then(() => {
                    context.uploadFile(file)
                }).catch( msg => {
                    console.log(msg)
                })  
            }

            input.click()
        },
        addFile(e) {
            let droppedFile = e.dataTransfer.files[0]
            if(!droppedFile) return;
            this.uploadFile(droppedFile) 
            this.unsetDragStyle()
        },
        setDragStyle() {
            this.$refs.dropzone.classList.add("dragging")
        },
        unsetDragStyle() {
            this.$refs.dropzone.classList.remove("dragging")
        },
        uploadFile(file) {
            const context = this

            blobToBase64(file).then(base64 => {
                context.image.base64 = base64 
                context.image.activeURL = URL.createObjectURL(file)
            })
        },
        removeImage() {
            const context = this

            context.image.base64 = null 
            context.image.activeURL = null
            
            this.setDragStyle()
            this.openImageSelector()
        },
    }
}

</script>
<template>
<div class="main__container">
<div class="image-preview__wrapper">
    <div v-if="image.activeURL" class="image-preview__image">
        <div class="text-in-corner" @click="removeImage">Select new image</div>
        <img :src="image.activeURL">
    </div>
    <div v-show="!image.activeURL" :class="[error?'error':'', 'image-preview__dropzone']" 
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
<div class="webcam__container">
    <video class="webcam__video" @loadedmetadata="onPlay()" ref="video" id="inputVideo" width="500px" height="500px" autoplay/>
    <div class="text-in-corner">Your webcam</div>
    <canvas ref="overlay" class="webcam__canvas"/>
</div>
<div>
Logs ... 
</div>
</div>
</template>
<style lang='scss'>
@import '@/assets/scss/pages/main.scss';
</style>
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
            error: false,
        }
    },
    mounted() {
      Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
            faceapi.nets.faceExpressionNet.loadFromUri('./models')
        ]).then(() => {
            this.startVideo(this.$refs.video, this.openModal).then(stream => {
                console.log(stream)
            })
        }).catch(err => {
            console.log(`Error: ${err}`)
        })
    .catch(err => {
       
    })
  },
  methods: { 
        ...mapActions({
            validateImage: 'utils/validateImage',
        }),
        openModal(id, text) {
            console.log(`Open modal with id:${id}`)  
        },
        onPlay() {
            const videoEl = this.$refs.video;
            let inputSize = 512
            let scoreThreshold = 0.5
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })

            faceapi
            .detectSingleFace(videoEl, options)
            .withFaceLandmarks()
            .withFaceDescriptor()
            .then(result => {
                console.log(result);
                if (result) {
                    const faceMatcher = new faceapi.FaceMatcher(result)
                    const bestMatch = faceMatcher.findBestMatch(result.descriptor)
                    
                    console.log(bestMatch.toString())
                    const canvas = this.$refs.overlay;
                    const dims = faceapi.matchDimensions(canvas, videoEl, true)
                    faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims))
                }
                setTimeout(() => { this.onPlay() })
            })
        },
        startVideo(video, openModal) {
            return new Promise ((resolve, reject) => {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia
            
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({ video: {} }, 
                    (stream) => {
                        video.srcObject = stream
                        resolve(stream)
                    }, (error) => {
                        openModal('error', 'Enable camera')
                        return reject()
                    })

                } else {
                    throw({ statusCode: 403, message: 'To fix this problem - enable Camera in browser' })
                    return reject()
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
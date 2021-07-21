<template>
  <div class="profile">

    <div class="input-row">
      <span class="profile-label">{{$t('profile.name')}}</span>
      <input v-model="name" class="form-input-control" />
    </div>

    <div class="input-row">
      <span class="profile-label">{{$t('profile.avatar')}}</span>
      <button @click="chooseFile" class="upload-img-btn">{{$t('profile.file')}}</button>
      <button v-if="image" @click="upload" class="upload-img-btn">{{$t('profile.upload')}}</button>
      <input accept=".jpg, .jpeg, .png" ref="upload" type="file" class="input-file" @change="onFileChange">
    </div>

    <img v-if="imgPreview" :src="imgPreview" alt="img" class="preview" />

  </div>
</template>

<script>
import { mapState } from "vuex";
import { UPLOAD_AVATAR } from "../../store/actions";
import FormInput from "../../components/FormInput/FormInput";

export default {
  name: "Profile",
  data: () => ({
    name: "",
    image: null,
    imgPreview: null,
  }),
  components: {
    FormInput
  },
  computed: {
    ...mapState(['player']),
  },
  methods: {
    chooseFile() {
      this.$refs.upload.click()
    },

    onFileChange(e) {
      this.image = e.target.files[0];
      this.imgPreview = URL.createObjectURL(e.target.files[0]);
    },

    upload() {
      this.$store.dispatch(UPLOAD_AVATAR, this.image);
    }
  },
  mounted() {
    this.name = this.player.name
  }
};
</script>

<style lang="scss">
@import "profile";
</style>

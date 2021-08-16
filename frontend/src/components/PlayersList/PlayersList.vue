<template>
  <div class="list-block">
    <div class="list-header">
      {{$t('lobby.playersOnline')}}
    </div>
    <transition-group name="list-animation" tag="ul" class="players-online-list">
      <li
          v-for="player in playersOnlineFiltered"
          class="players-online-list-item"
          :key="player.id"
      >
        <p>{{ player.name }}</p>
        <div class="inviteButtons" v-if="!hasReceivedInvitation(player)">
          <app-button
              @click="sendInvitation(player)"
              v-if="hasSentInvitation(player)"
          >{{$t('lobby.invite')}}</app-button
          >
          <app-button
              @click="cancelInvite(player)"
              v-else-if="!hasSentInvitation(player)"
          >{{$t('lobby.cancel')}}</app-button
          >
        </div>
        <div class="inviteButtons" v-else-if="hasReceivedInvitation(player)">
          <app-button @click="acceptGameRequest(player)">{{$t('lobby.accept')}}</app-button>
          <app-button @click="declineGameRequest(player)">{{$t('lobby.decline')}}</app-button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AppButton from "../../components/Button/AppButton";
import { FIND_MATCH } from "../../store/actions";

export default {
  name: "PlayersList",
  components: {
    AppButton
  },
  computed: {
    ...mapState(["player"]),
    ...mapGetters(["playersOnlineFiltered"]),
  },
  methods: {
    findMatch() {
      this.$store.dispatch(FIND_MATCH, this.$socket);
    },

    hasSentInvitation(user) {
      return !user.from.some((id) => id === this.player.id);
    },

    hasReceivedInvitation(user) {
      return user.to.some((id) => id === this.player.id);
    },

    sendInvitation(user) {
      const request = this.makeReqObj(user);
      this.$socket.emit("SEND_INVITATION", request)
    },

    cancelInvite(user) {
      const request = this.makeReqObj(user);
      this.$socket.emit("CANCEL_INVITATION", request)
    },

    acceptGameRequest(user) {
      const request = this.makeReqObj(user);
      this.$socket.emit("ACCEPT_GAME_REQUEST", request);
    },

    declineGameRequest(user) {
      const request = this.makeReqObj(user);
      this.$socket.emit("DECLINE_GAME_REQUEST", request);
    },

    makeReqObj(user) {
      return {
        from: { name: this.player.name, id: this.player.id },
        to: { name: user.name, id: user.id },
      };
    },
  },
}
</script>

<style lang="scss">
@import "players-list";
</style>
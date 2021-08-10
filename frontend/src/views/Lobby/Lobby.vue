<template>
  <div class="lobby">
    <div class="list-block">
      <div class="list-header">{{$t('lobby.statistics')}}</div>
      <ul class="players-online-list">
        <li
          class="players-online-list-item"
          v-for="stat in stats"
          :key="stat.name"
        >
          {{ stat.name }}: {{ stat.value }}
        </li>
      </ul>
    </div>
    <app-button @click="findMatch" :disabled="isLookingForMatch">
      <span v-if="isLookingForMatch" :class="loading">
        <loader />
      </span>
      <span :class="{'no-text': isLookingForMatch}">{{$t('lobby.findMatch')}}</span>
    </app-button>
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
  </div>
</template>

<script>
import { FIND_MATCH } from "../../store/actions";
import { mapState, mapGetters } from "vuex";
import AppButton from "../../components/Button/AppButton";
import Loader from "../../components/Loader/Loader";

export default {
  name: "Lobby",
  components: {
    AppButton,
    Loader
  },
  computed: {
    ...mapState(["player", "isLookingForMatch"]),
    ...mapGetters(["playersOnlineFiltered"]),

    loading() {
      return this.isLookingForMatch && "loading"
    }
  },
  data: () => ({
    stats: [
      { name: "Shots fired", value: 140 },
      { name: "Bullseye", value: 12 },
      { name: "Shots Missed", value: 128 },
      { name: "Games Played", value: 12 },
      { name: "Wins", value: 1 },
      { name: "Losses", value: 11 },
      { name: "Win Rate", value: "10%" },
    ],
  }),
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
};
</script>

<style lang="scss">
@import "lobby";
</style>

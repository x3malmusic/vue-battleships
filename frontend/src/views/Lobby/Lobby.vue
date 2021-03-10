<template>
  <div class="lobby">
    <div>
      <div class="list-header">statistics</div>
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
      Find match
    </app-button>
    <div>
      <div class="list-header">
        players online
      </div>
      <ul class="players-online-list">
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
              >Invite</app-button
            >
            <app-button
              @click="cancelInvite(player)"
              v-else-if="!hasSentInvitation(player)"
              >Cancel</app-button
            >
          </div>
          <div class="inviteButtons" v-else-if="hasReceivedInvitation(player)">
            <app-button @click="acceptGameRequest(player)">Accept</app-button>
            <app-button @click="declineGameRequest(player)">Decline</app-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { FIND_MATCH } from "../../store/mutations";
import { mapState, mapMutations, mapGetters } from "vuex";
import AppButton from "../../components/Button/AppButton";

export default {
  name: "Lobby",
  components: {
    AppButton,
  },
  computed: {
    ...mapState(["player", "isLookingForMatch"]),
    ...mapGetters(["playersOnlineFiltered"]),
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
    ...mapMutations(["SOCKET_updatePlayers"]),

    findMatch() {
      this.$store.commit(FIND_MATCH, this.$socket);
    },

    hasSentInvitation(user) {
      return !user.from.some((id) => id === this.player.id);
    },

    hasReceivedInvitation(user) {
      return user.to.some((id) => id === this.player.id);
    },

    sendInvitation(user) {
      const request = this.makeReqObj(user);

      this.$socket.emit("sendInvitation", request, ({ playersList }) => {
        this.SOCKET_updatePlayers(playersList);
        this.$_notify(
          user.name + " " + this.$t("messages.playerReceivedInvite")
        );
      });
    },

    cancelInvite(user) {
      const request = this.makeReqObj(user);

      this.$socket.emit("cancelInvitation", request, ({ playersList }) => {
        this.SOCKET_updatePlayers(playersList);
        this.$_notify(this.$t("messages.canceled"));
      });
    },

    acceptGameRequest(user) {
      const request = this.makeReqObj(user);

      this.$socket.emit("acceptGameRequest", request, ({ playersList }) => {
        this.SOCKET_updatePlayers(playersList);
      });
    },

    declineGameRequest(user) {
      const request = this.makeReqObj(user);

      this.$socket.emit("declineGameRequest", request, ({ playersList }) => {
        this.SOCKET_updatePlayers(playersList);
      });
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

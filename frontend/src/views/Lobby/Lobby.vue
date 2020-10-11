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
            <app-button>Accept</app-button>
            <app-button>Decline</app-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import AppButton from "../../components/Button/AppButton";

export default {
  name: "Lobby",
  components: {
    AppButton,
  },
  computed: {
    ...mapState(["player"]),
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

    makeReqObj(user) {
      return {
        from: this.player,
        to: user,
      };
    },
  },
};
</script>

<style lang="scss">
@import "lobby";
</style>
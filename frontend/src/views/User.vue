<template>
  <main class="main">
    <div v-for="item in userInfos" :key="item">
      <div class="main__header" v-for="item in userInfos" :key="item">
        <i class="fa-solid fa-address-card"></i>

        <h1 v-if="user.id == this.$route.params.id">Mon profil</h1>
        <h1 v-else>Profil de {{ item.firstname }} {{ item.lastname }}</h1>
      </div>
      <div class="container-user">
        <div class="container-user__card">
          <img v-if="item.avatar != null" :src="item.avatar" />
          <div class="container-user__card__info">
            <p>{{ item.firstname }} {{ item.lastname }}</p>
            <p>{{ item.role }}</p>
            <p>{{ item.email }}</p>
          </div>
        </div>
      </div>
      <p
        class="btn btn-edit"
        v-if="this.$route.params.id == user.id || user.isAdmin == true"
        @click="this.$router.push(`/editUser/${this.$route.params.id}`)"
      >
        Modifier profil
      </p>
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "User",

  mounted() {
    let userInLocalStorage = JSON.parse(localStorage.getItem("user"));

    if (userInLocalStorage == null) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getUserInfos");
      this.$store.dispatch("getAllUsers");
    }
  },
  computed: {
    ...mapState({ user: "userInfos" }),
    userInfos() {
      return this.$store.state.allUsersInfos.filter(
        (item) => item.id == this.$route.params.id
      );
    },
  },
  methods: {
    formatDate(bddDate) {
      const date = new Date(bddDate);

      const day = date.toLocaleDateString();

      const time = date.toLocaleTimeString();

      return `le ${day} à ${time}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
.container-user {
  display: flex;
  flex-direction: column;
  &__card {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px;
    background-color: white;
    border: solid 1px #dfe0e3;
    border-radius: 5px;

    &__info {
      display: flex;
      flex-direction: column;
      align-items: baseline;
      font-size: 14px;
    }
    img {
      height: 150px;
      width: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 20px;
    }
  }
  &__card__bio {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 2%;
    margin-bottom: 2%;
    span {
      margin-top: 2%;
      font-style: italic;
    }
  }
}
</style>

<template>
  <header>
    <div class="container-header">
      <div class="container-header__logo">
        <img src="../assets/logo-header.png" alt="Logo Groupomania" />
      </div>
      <div class="nav">
        <ul class="nav__ul">
          <li class="nav__li" @click="this.$router.push('/home')">
            <i class="fa-solid fa-house"></i>
          </li>
          <li class="nav__li" @click="getOneUser">
            <i class="fas fa-user"></i>
          </li>
          <li class="nav__li" @click="deconnectUser">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>


<script>
import axios from "axios";

export default {
  name: "Header",

  methods: {
    deconnectUser() {
      localStorage.clear();
      this.$router.go();
    },
    getOneUser() {
      let userInLocalStorage = JSON.parse(localStorage.getItem("user"));

      if (userInLocalStorage != null) {
        let userId = userInLocalStorage.map((user) => user.userId);

        let userToken = userInLocalStorage.map((user) => user.token);

        axios
          .get(`http://localhost:3000/api/auth/${userId}`, {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          })
          .then(this.$router.push(`/user/${userId}`))
          .catch(() => {
            alert("Impossible d'être redirigé");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  border-bottom: solid 3px #ffd8d8;
  background-color: white;
}

.container-header {
  display: flex;
  justify-content: space-between;

  align-items: center;
  width: 80%;
  margin: auto;
  flex-wrap: wrap;
  &__logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      height: 40px;
      padding: 10px 0;
      width: auto;
    }
  }
}

.nav {
  display: flex;
  flex-direction: row;
  color: #2e405d;
  &__ul {
    display: flex;
    flex-direction: row;
    list-style: none;
  }
  &__li {
    display: flex;
    margin: 0 20px;
    &:hover {
      color: #fd3004;
      transition-duration: 200ms;
      cursor: pointer;
    }
  }
}
</style>

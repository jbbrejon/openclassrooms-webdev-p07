<template>
  <header>
    <div v-if="user.id != undefined" class="header">
      <Header />
    </div>
    <div v-else class="header">
      <HeaderLog />
    </div>
    <router-view />
  </header>
</template>

<script>
import Header from "./components/Header.vue";
import HeaderLog from "./components/HeaderLog.vue";
import { mapState } from "vuex";

export default {
  components: {
    Header,
    HeaderLog,
  },
  mounted() {
    this.$store.dispatch("getUserInfos");
  },
  computed: {
    ...mapState({ user: "userInfos" }),
  },
};
</script>

<style lang="scss">
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
}
.generalBody {
  margin: 0px;
  padding: 0px;
}

.main {
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  &__header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    i {
      color: #2e405d;
      font-size: 25px;
    }
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: auto;
  height: 100%;
  background-color: #f0f2f5;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 22px;
  font-weight: bold;
  color: #2e405d;
}

.card-create {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  border: solid 1px #dfe0e3;
  &__form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    &__description {
      width: 69%;
      height: 30px;
      border-radius: 10px 0px 0px 10px;
    }
  }
}

input:focus {
  outline: none;
}

label {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  margin-left: 5px;
  font-size: 12px;
  font-weight: bolder;
}

textarea:focus {
  outline: none;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: auto;
}

.button-create {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1b74e4;
  border-radius: 0px 10px 10px 0px;
  font-weight: bold;
  color: white;
  height: 35px;
  width: 20%;
  margin: 0;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.12);
  transition: all 200ms;
  border: none;
  font-size: 15px;
  &:hover {
    cursor: pointer;
    filter: brightness(1.07);
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.19), 2px 2px 2px rgba(0, 0, 0, 0.23);
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  margin: 5px 10px;
  border: none;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  opacity: 80%;
  transition: 200ms;
  &:hover {
    cursor: pointer;
    opacity: 100%;
  }
}

.btn-post {
  background-color: #007bff;
}

.btn-edit {
  background-color: #fd3407;
}

.btn-delete {
  background-color: #dc3545;
}

.container-buttons {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
}

.form-modify {
  margin-right: 10px;
  text-align: left;
  &__description {
    border-radius: 10px;
  }
}

.button-comment {
  border: none;
  background: none;
  color: #2c3e50;
  &:hover {
    cursor: pointer;
  }
}

.form-container {
  display: flex;
  width: 350px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  background-color: white;
  border: solid 1px #dfe0e3;
  border-radius: 20px;
  &__title {
    font-size: 16px;
    margin: 5px 0 0 0;
  }
}

.form {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  &__label {
    display: flex;
    width: 90%;
    padding: 5px 10px;
    margin: 0;
  }
  &__input-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 90%;
    background-color: #f0f2f5;
    padding: 5px 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 25px;
    opacity: 80%;
    &:hover {
      opacity: 100%;
      border: solid 1px #ffd8d8;
      height: 23px;
    }
  }
  &__file {
    display: flex;
    font-size: 50px;
    color: grey;
  }
}

input[type="file"] {
  display: none;
}

.picture__input {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 18px;
  color: grey;
}

@media only screen and (max-width: 768px) {
  .button-create {
    font-size: 12px;
  }
}
</style>

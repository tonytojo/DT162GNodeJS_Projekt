<template>
  <div class="outer-container">
    <div class="inner-container">
      <form class="left-col-form" action="#">
          <!--   Input title -->
          <div class="rad">
            <div class="col-25">
              <label for="title">Titel</label>
            </div>
            <div class="col-75">
              <input
                type="text"
                v-model="title"
                id="title"
                name="title"
                placeholder="Ange titel..."
              />
            </div>
          </div>

          <!--   Input märkning -->
          <div class="rad">
            <div class="col-25">
              <label for="label">Märkning</label>
            </div>
            <div class="col-75">
              <input
                type="text"
                v-model="label"
                id="label"
                name="label"
                placeholder="Ange märkning..."
              />
            </div>
          </div>

          <!--   Input position -->
          <div class="rad">
            <div class="col-25">
              <label for="position">Position</label>
            </div>
            <div class="col-75">
              <input
                type="text"
                v-model="position"
                id="position"
                name="position"
                placeholder="Ange position..."
              />
            </div>
          </div>

          <!--   Input förpackning -->
          <div class="rad">
            <div class="col-25">
              <label for="wrapping">Förpackning</label>
            </div>
            <div class="col-75">
              <select id="wrapping" name="wrapping" v-model="wrapping">
                <option value="Löst">Löst</option>
                <option value="Låda">Låda</option>
                <option value="Påse">Påse</option>
                <option value="Resegarderob">ReseGarderob</option>
              </select>
            </div>
          </div>

          <!-- Input text -->
          <div class="rad">
            <div class="col-25">
              <label for="text">Text</label>
            </div>

            <div class="col-75">
              <textarea id="text" name="text" v-model="text" placeholder="Ange text..."></textarea>
            </div>
          </div>
          <input class="btn" type="submit" @click="reset" value="Reset" />
          <input
            class="btn"
            type="submit"
            @click="createPost"
            value="Lägg till"
          />
          <input
            class="btn"
            type="submit"
            @click="updatePost"
            value="Uppdatera"
          />
      </form>

      <div class="right-col">
        <p style="padding:10px">Förnärvarande finns det {{this.nrofItems }} poster i databasen</p>
        <h2>Vinds hanteraren.</h2>
        <div class="post" v-for="post in posts" :id="post._id" :key="post._id">
          <div class="text">
            <p>
              <span class="bold">Titel:</span>
              {{post.title}}
            </p>
            <p>Märkning: {{post.label}}</p>
            <p>Position: {{post.position}}</p>
            <p>Förpackning: {{post.wrapping}}</p>
            <p>Text: {{post.text}}</p>
            <p>Skapad: {{post.createdAt }}</p>
            <p>Ändrad: {{post.modified }}</p>

            <button class="btn" @click="deletePost(post._id)">Radera</button>
            <button
              class="btn"
              @click="prepareUpdatePost(post._id, post.title, post.label, post.position, post.wrapping, post.text)"
            >Uppdatera</button>
          </div>
        </div>
      </div>
      <!-- end right-col -->
    </div>
  </div>
</template>

<script>
import PostService from "../PostService";

export default {
  name: "PostComponent",
  data() {
    return {
      posts: [],
      error: "",
      title: "",
      text: "",
      label: "",
      position: "",
      wrapping: "Löst",
      id: "",
      nrofItems: "0",
      createdAt: "",
      modified: ""
    };
  },
  async created() {
    try {
      this.posts = await PostService.getPosts();
      this.nrofItems = this.posts.length;
        console.log("Antal poster this.nrofItems:" + this.nrofItems);
    } catch (err) {
      this.error = err.message;
    }
  },
  async updated() {
    var id = localStorage.id;

    if (id != "null" && id) {
      document.getElementById(id).scrollIntoView();
      document.getElementById(id).style.backgroundColor = "Green";
      await new Promise(r => setTimeout(r, 3000));
      document.getElementById(id).style.backgroundColor = "#d9d9d9";
      localStorage.id = null;
    }
  },
  methods: {
    reset(e) {
      e.preventDefault();
      this.id = "";
      this.clear();
    },
    clear() {
      this.title = "";
      this.label = "";
      this.text = "";
      this.position = "";
    },
    getTimeDate() {
      let date = new Date();
      var createdAt =
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2) +
        " " +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2);

      return createdAt;
    },
    prepareUpdatePost(id, title, label, position, wrapping, text) {
      this.id = id;
      this.title = title;
      this.label = label;
      this.position = position;
      this.wrapping = wrapping;
      this.text = text;
      this.modified = this.getTimeDate();
    },
    //Validate that the form is valid
    validatePosInForm() {
      let position = this.position.trim().toLowerCase();
      return /^([vh][1-6])$/.test(position) ? true : false;
    },

    async createPost(e) {
      e.preventDefault();

      if (confirm("Vill du verkligen skapa en ny post")) {
        if (this.title.trim() != "" && this.position.trim() != "") {
          if (!this.validatePosInForm()) {
            alert("Format position h1-h6 eller v1-v6");
            return;
          }

          let createdAt = this.getTimeDate();
          let modified = createdAt;

          await PostService.insertPost(
            this.title,
            this.label,
            this.position,
            this.wrapping,
            this.text,
            createdAt,
            modified
          );
          this.posts = await PostService.getPosts();
           this.nrofItems = this.posts.length;
          this.clear();
        } else {
          alert("Title och position är obligatoriska fält");
        }
      }
    },

    async deletePost(id) {
      if (confirm("Vill du verligen ta bort denna post")) {
        await PostService.deletePost(id);
        this.posts = await PostService.getPosts();
        this.nrofItems = this.posts.length;
      }
    },
    async updatePost(e) {
      e.preventDefault();
      localStorage.id = this.id;
      this.modified = this.getTimeDate();
      await PostService.updatePost(
        this.id,
        this.title,
        this.label,
        this.position,
        this.wrapping,
        this.text,
        this.modified
      );
      this.posts = await PostService.getPosts();
      this.clear();
    }
  }
  }
</script>


<style>
@import "../assets/styles/style.css";

h2 {
  font-size: 2em;
  margin: 10px;
}

button:hover {
  cursor: pointer;
  background-color: #003300;
  border-bottom: 1px solid #000;
}

div.post {
  width: 100%;
  max-width: 400px;
  display: block;
  margin: auto;
  text-align: left;
}

.text {
  border-top: 1px solid #000;
  padding-top: 1em;
  overflow: hidden;
  padding: 1.5em;
}
</style>

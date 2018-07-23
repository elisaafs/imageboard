(function() {
    // Vue.componente("image-modal"),
    //     {
    //         props: ["id"],
    //         mounted: function() {},
    //         method:
    //         template: '<div id="image-modal"><h1>{{id}}</h1></div>'
    //     };
    let app;

    const imageModal = Vue.component("image-modal", {
        mounted: function() {
            const id = this.$route.params.id;
            axios.get(`/image/${id}`).then(res => {
                this.imageDetails = res.data.imageDetails;
                this.tags = res.data.tags;
            });
            axios.get(`/comments/${id}`).then(res => {
                this.comments = res.data;
            });
        },
        methods: {
            closemodal: function(event) {
                if (event.currentTarget === event.target) {
                    this.$router.go(-1);
                }
            },
            onSubmit: function() {
                axios
                    .post(`/comment`, {
                        imageId: this.$route.params.id,
                        username: this.newUserName,
                        comment: this.newComment
                    })
                    .then(res => {
                        this.comments.unshift(res.data.comment);
                    });
            }
        },
        data: function() {
            return {
                comments: {},
                imageDetails: {},
                tags: [],
                newUserName: "",
                newComment: ""
            };
        },
        template: "#image-modal"
    });

    const imagesOverview = Vue.component("images-overview", {
        mounted: function() {
            this.tag = this.$route.params.tag;
            this.images = [];
            this.offset = 0;
            this.loadNextBatch();
            this.$parent.$on("new image", image => {
                this.images.unshift(image);
            });
        },
        methods: {
            loadNextBatch: function() {
                if (this.tag) {
                    axios
                        .get(
                            "/images/tag/" +
                                this.tag +
                                `?limit=${this.limit}&offset=${this.offset}`
                        )
                        .then(res => {
                            this.images = this.images.concat(res.data);
                            if (res.data.length != this.limit) {
                                this.moreAvailable = false;
                            }
                            this.offset += this.limit;
                        });
                } else {
                    axios
                        .get(
                            "/images" +
                                `?limit=${this.limit}&offset=${this.offset}`
                        )
                        .then(res => {
                            this.images = this.images.concat(res.data);
                            if (res.data.length != this.limit) {
                                this.moreAvailable = false;
                            }
                            this.offset += this.limit;
                        });
                }
            },
            more: function(event) {
                this.loadNextBatch();
            }
        },
        data: function() {
            return {
                tag: undefined,
                offset: 0,
                limit: 8,
                moreAvailable: true,
                images: []
            };
        },
        template: "#images-overview"
    });

    const router = new VueRouter({
        routes: [
            { path: "/image/:id", components: { "image-details": imageModal } },
            {
                path: "/tag/:tag",
                components: { "image-overview": imagesOverview }
            },
            {
                path: "/",
                components: { "image-overview": imagesOverview }
            }
        ]
    });

    app = new Vue({
        el: "#main",
        router,
        data: {
            selectedImage: "",
            title: "",
            description: "",
            username: "",
            error: "",
            tags: ""
        },
        mounted: function() {},
        methods: {
            imageSelected: function(e) {
                this.imageFile = "" || e.target.files[0];
                app.selectedImage = "" || e.target.files[0].name;
            },
            upload: function() {
                if (
                    this.imageFile &&
                    this.title &&
                    this.description &&
                    this.username
                ) {
                    var formData = new FormData();
                    formData.append("file", this.imageFile);
                    formData.append("title", this.title);
                    formData.append("description", this.description);
                    formData.append("username", this.username);
                    formData.append("tags", this.tags);
                    axios.post("/upload", formData).then(function(res) {
                        if (res.data.success) {
                            app.$emit("new image", res.data.image);
                            //app.images.unshift(res.data.image);
                            app.selectedImage = "";
                            app.title = "";
                            app.description = "";
                            app.username = "";
                            app.error = "";
                        }
                    });
                    app.imageFile = "";
                } else {
                    app.error = "Please fill all the fields below.";
                }
            }
        }
    });
})();

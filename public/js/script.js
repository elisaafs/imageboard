(function() {
    // Vue.componente("image-modal"),
    //     {
    //         props: ["id"],
    //         mounted: function() {},
    //         method:
    //         template: '<div id="image-modal"><h1>{{id}}</h1></div>'
    //     };

    Vue.component("image-modal", {
        props: ["id"],
        mounted: function() {
            axios.get(`/image/${this.id}`).then(res => {
                this.imageDetails = res.data;
            });
            axios.get(`/comments/${this.id}`).then(res => {
                this.comments = res.data;
            });
        },
        methods: {
            closemodal: function(e) {
                this.$emit("closemodal", e);
            },
            onSubmit: function() {
                axios
                    .post(`/comment`, {
                        imageId: this.id,
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
                newUserName: "",
                newComment: ""
            };
        },
        template: "#image-modal"
    });

    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            selectedImage: "",
            title: "",
            description: "",
            username: "",
            error: "",
            imageModalOpen: false,
            imageIdForModal: 0
        },
        mounted: function() {
            axios.get("/images").then(function(res) {
                app.images = res.data;
            });
        },
        methods: {
            imageSelected: function(e) {
                this.imageFile = "" || e.target.files[0];
                app.selectedImage = "" || e.target.files[0].name;
            },
            imageModal: function(id) {
                app.imageModalOpen = true;
                app.imageIdForModal = id;
            },
            closemodal: function(event) {
                if (event.currentTarget === event.target) {
                    app.imageModalOpen = false;
                }
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
                    axios.post("/upload", formData).then(function(res) {
                        if (res.data.success) {
                            app.images.unshift(res.data.image);
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

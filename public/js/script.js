(function() {
    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            selectedImage: "",
            title: "",
            description: "",
            username: "",
            error: ""
        },
        mounted: function() {
            axios.get("/images").then(function(res) {
                app.images = res.data;
                console.log(app.images);
            });
        },
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
                    console.log(this.description, this.title);
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

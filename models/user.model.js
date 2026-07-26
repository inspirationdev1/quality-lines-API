import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAV1BMVEX///8AAABYWFj7+/u/v79ubm6ZmZni4uKysrLOzs6UlJR/f39cXFx2dnYRERG6urrz8/M8PDyKiopnZ2dhYWFMTEzq6urY2NiqqqpTU1NFRUUsLCyfn58519ruAAABoElEQVRoge3YCZKCMBCF4TRh04gsrqj3P+foVI0L0BGkO1ZNve8CfyVAEmIMAAAAAAAAgBQbN0kUJU1sg2b3ju7cPlw3pRdpoKxdUccqyHzbttslakOUi36XqNDvxkNdolg9vB4Or7W7zID1h7zhwhvdruW6RLovdsaHM9Xwgg8vVMPsu6X9dn1txF97xl97q82W6251u6bkwqVy2HBh7S43ZPUBG5MMdRP9rql2/e4uyNmn6p192ipE96p57TaBslfZ07ac6C5ZXTZ3UV1HLg/7JwGgZx+nTZEkhUvjgH+pZef3qQiwQxhzGP5pO2hne//Gf1aa6arhsr9LttpWsah9XaJa6YR79Gdvjhpd7zTfp1u+695Xb5x0dzmuS7SU7eZju0S5ZPcwvksk+EHb05TwSe5Qkr6vPRO7YsyYKybOWur4N/JLehD6pqYOWGzIoz/hB5mP+Tw9fJboeu5beBL71AczLTPXbzbhYfX8rueex2f+6jVpmX6Yv2B7LhF95l8wTtgQn83fHC+fhS+zw8c2+kCrcuwDAAAAAACA/+4HEIoOqarDhJEAAAAASUVORK5CYII="
    },
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
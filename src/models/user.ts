import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// attrs | parameters requried for creating a new user.
interface userAttrs {
    username : string;
    password : string,
    email : string
}

interface UserDoc extends Document {
    username : string;
    password : string,
    email : string
}

interface UserModel extends Model<UserDoc>{
    build(attrs: userAttrs) : UserDoc;
}

const userSchema = new Schema({
    username: {
        type: String,
        requred: true
    },
    email: {
        type: String,
        required: true
    },
    password : {
        type : String,
        requried : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.build = function(attrs : userAttrs) {
    return new User(attrs);
}

userSchema.pre("save", async function(done) {
    if(this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(this.get("password"), salt);
        this.set("password", hash);
    }
    done();
})

const User = model<UserDoc, UserModel>("User", userSchema);

export {
    User
};
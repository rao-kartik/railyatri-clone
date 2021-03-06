import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'; 

import IUser from '../types/user.types';

enum roles {
    admin = "admin",
    owner = "owner",
    user = "user"
}

const userSchema = new Schema ({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: String,
        minLength: 10,
        maxLength: 10
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    companyName: {
        type: String,
        default: 'NA'
    },
    tickets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ticket',
        }
    ],
    role: {
        type: String,
        enum: Object.values(roles),
        default: 'user',
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
});

userSchema.pre<IUser>('save', function(this: IUser, next: any) {
    
    if(!this.isModified('password')) return next;

    bcrypt.hash(this.password, 8, (err, hash)=>{
        if(err) return next(err);

        this.password = hash;
        next();
    });
});

userSchema.methods.checkPassword = function (this: any, password) {
    const hashedPassword = this.password;

    return new Promise ((resolve, reject)=>{
        bcrypt.compare(password, hashedPassword, (err, same)=>{
            if (err) return reject(err);

            resolve(same);
        });
    });
};

const User = model<IUser>('user', userSchema);

export default User;
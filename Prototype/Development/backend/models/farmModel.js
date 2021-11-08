import mongoose from 'mongoose'
import Animal from './animalModel.js'

const employeeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        cnic: {
            type: String,
            required: true,
            unique: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        joinedAt: {
            type: Date,
            required: true
        },
        isWorking: {
            type: Boolean,
            required: true
        },
        leftAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
)

const farmSchema = mongoose.Schema(
    {
        farmName: {
            type: String,
            required: true
        },
        subdomain: {
            type: String,
            required: true,
            unique: true
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        ],
        animals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Animal'
            }
    ],
    },
    {
        timestamps: true
    }
)

farmSchema.methods.checkUserById = async function(id) {
    let user = this.users.find(u => {
        return u == id ? u : null
    })
    return user ? true : false
}

farmSchema.methods.getAnimalsData = async function() {
    var results = await Promise.all(
      this.animals.map(async (a) => {
        let animalData = await Animal.findById(a);
        return animalData;
      })
    );
    return results
}

const Farm = mongoose.model('Farm', farmSchema)

export default Farm
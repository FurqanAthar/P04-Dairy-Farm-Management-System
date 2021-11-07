import mongoose from 'mongoose'

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
        // employees: [employeeSchema],
        // animals: [animalSchema],
    },
    {
        timestamps: true
    }
)

const Farm = mongoose.model('Farm', farmSchema)

export default Farm
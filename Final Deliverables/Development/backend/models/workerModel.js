import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        work: {
            type: String,
            required: true
        },
        cnic: {
            type: String,
            unique: true
        },
		salary: {
			type: Number,
			required: true
		},
        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farm"
        },
        status: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

const Worker = mongoose.model('Worker', userSchema)

export default Worker
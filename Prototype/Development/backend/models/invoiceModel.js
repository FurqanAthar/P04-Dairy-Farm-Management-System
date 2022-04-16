import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
    {
        number: {
            type: Number,
            required: true,
        },
        items: [
            {
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                rate: {
                    type: Number,
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
            },
        ],
		amount: {
			type: Number,
			required: true,
		},
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema)

export default Invoice
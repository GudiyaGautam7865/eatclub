
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.Mixed,
			ref: 'User',
			required: true,
			index: true,
		},
		label: {
			type: String,
			default: 'Address',
			trim: true,
			maxlength: 80,
		},
		type: {
			type: String,
			enum: ['Home', 'Work', 'Other'],
			default: 'Other',
		},
		address: {
			type: String,
			required: true,
			trim: true,
			maxlength: 500,
		},
		flat: { type: String, trim: true, maxlength: 120 },
		floor: { type: String, trim: true, maxlength: 120 },
		landmark: { type: String, trim: true, maxlength: 200 },
		latitude: { type: Number },
		longitude: { type: Number },
	},
	{ timestamps: true }
);

addressSchema.index({ user: 1, address: 1 }, { unique: true });

export default mongoose.model('Address', addressSchema);


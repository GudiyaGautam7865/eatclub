
import Address from '../models/Address.js';

export const listAddresses = async (req, res) => {
	const addresses = await Address.find({ user: req.user.id }).sort({ updatedAt: -1 });
	res.json({ success: true, data: addresses });
};

export const createAddress = async (req, res) => {
	const { address, label, type, flat, floor, landmark, latitude, longitude } = req.body;
	if (!address) {
		return res.status(400).json({ success: false, message: 'Address is required' });
	}

	const doc = await Address.create({
		user: req.user.id,
		address,
		label: label || 'Address',
		type: type || 'Other',
		flat,
		floor,
		landmark,
		latitude,
		longitude,
	});

	res.status(201).json({ success: true, data: doc });
};

export const updateAddress = async (req, res) => {
	const { id } = req.params;
	const updates = { ...req.body };
	delete updates.user;

	const updated = await Address.findOneAndUpdate(
		{ _id: id, user: req.user.id },
		updates,
		{ new: true }
	);

	if (!updated) {
		return res.status(404).json({ success: false, message: 'Address not found' });
	}

	res.json({ success: true, data: updated });
};

export const deleteAddress = async (req, res) => {
	const { id } = req.params;
	const deleted = await Address.findOneAndDelete({ _id: id, user: req.user.id });

	if (!deleted) {
		return res.status(404).json({ success: false, message: 'Address not found' });
	}

	res.json({ success: true, message: 'Address deleted' });
};


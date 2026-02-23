import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: { updatedAt: true, createdAt: false } });

if (mongoose.models.Settings) {
    delete mongoose.models.Settings;
}

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;

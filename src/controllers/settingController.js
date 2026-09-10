import Setting from "../models/Setting.js";

const getOrCreateSettings = async () => {
    let settings = await Setting.findOne();

    if (!settings) {
        settings = await Setting.create({});
    }

    return settings;
};

export const getSettings = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Get settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch settings"
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const {
            restaurantName,
            address,
            phone,
            email,
            currency,
            currencySymbol,
            gstEnabled,
            gstPercentage,
            serviceChargeEnabled,
            serviceChargePercentage,
            deliveryChargeEnabled,
            deliveryCharge
        } = req.body;

        let settings = await Setting.findOne();

        if (!settings) {
            settings = new Setting();
        }

        settings.restaurantName =
            typeof restaurantName === "string"
                ? restaurantName.trim()
                : settings.restaurantName;

        settings.address =
            typeof address === "string"
                ? address.trim()
                : settings.address;

        settings.phone =
            typeof phone === "string"
                ? phone.trim()
                : settings.phone;

        settings.email =
            typeof email === "string"
                ? email.trim()
                : settings.email;

        settings.currency =
            typeof currency === "string"
                ? currency.trim().toUpperCase()
                : settings.currency;

        settings.currencySymbol =
            typeof currencySymbol === "string"
                ? currencySymbol.trim()
                : settings.currencySymbol;

        if (typeof gstEnabled === "boolean") {
            settings.gstEnabled = gstEnabled;
        }

        if (gstPercentage !== undefined) {
            const value = Number(gstPercentage);

            if (Number.isNaN(value) || value < 0 || value > 100) {
                return res.status(400).json({
                    success: false,
                    message: "GST percentage must be between 0 and 100"
                });
            }

            settings.gstPercentage = value;
        }

        if (typeof serviceChargeEnabled === "boolean") {
            settings.serviceChargeEnabled = serviceChargeEnabled;
        }

        if (serviceChargePercentage !== undefined) {
            const value = Number(serviceChargePercentage);

            if (Number.isNaN(value) || value < 0 || value > 100) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Service charge percentage must be between 0 and 100"
                });
            }

            settings.serviceChargePercentage = value;
        }

        if (typeof deliveryChargeEnabled === "boolean") {
            settings.deliveryChargeEnabled = deliveryChargeEnabled;
        }

        if (deliveryCharge !== undefined) {
            const value = Number(deliveryCharge);

            if (Number.isNaN(value) || value < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Delivery charge cannot be negative"
                });
            }

            settings.deliveryCharge = value;
        }

        await settings.save();

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings
        });
    } catch (error) {
        console.error("Update settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update settings"
        });
    }
};

export const getPublicSettings = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        res.status(200).json({
            success: true,
            data: {
                restaurantName: settings.restaurantName,
                currency: settings.currency,
                currencySymbol: settings.currencySymbol,

                gstEnabled: settings.gstEnabled,
                gstPercentage: settings.gstPercentage,

                serviceChargeEnabled:
                    settings.serviceChargeEnabled,
                serviceChargePercentage:
                    settings.serviceChargePercentage,

                deliveryChargeEnabled:
                    settings.deliveryChargeEnabled,
                deliveryCharge:
                    settings.deliveryCharge
            }
        });
    } catch (error) {
        console.error("Get public settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch settings"
        });
    }
};
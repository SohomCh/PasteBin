const { Paste } = require("../models/paste.model");
const { nanoid } = require("nanoid");
const redis = require("../services/cache.services");

// ========================================
// Generate a unique 7-character Paste ID
// ========================================
function generatePasteId() {
    return nanoid(7);
}

// ========================================
// Create a New Paste
// ========================================
async function createPaste(data, userId) {
    try {

        // ================================
        // 1. Validate Content
        // ================================
        if (!data.content || data.content.trim() === "") {
            throw new Error("Content is required");
        }

        // ================================
        // 2. Generate Unique Paste ID
        // ================================
        const pasteId = generatePasteId();

        // ================================
        // 3. Public / Private Paste
        // Default -> Public
        // ================================
        const isPublic =
            data.isPublic !== undefined
                ? data.isPublic
                : true;

        // ================================
        // 4. Handle Expiry Date
        // Frontend sends:
        // "2026-07-29"
        // ================================
        let expiresAt;

        if (data.expiry) {

            expiresAt = new Date(data.expiry);

            // Invalid Date?
            if (isNaN(expiresAt.getTime())) {
                throw new Error("Invalid expiry value");
            }

            // Expire at end of selected day
            expiresAt.setHours(23, 59, 59, 999);
        }

        // ================================
        // 5. Create Paste Document
        // ================================
        const paste = new Paste({
            pasteId,
            content: data.content,
            userId,
            isPublic,
            expiresAt,
        });

        // ================================
        // 6. Save into MongoDB
        // ================================
        await paste.save();

        // ================================
        // 7. Return Created Paste
        // ================================
        return paste;

    } catch (error) {

        console.error("Create Paste Service:", error.message);
        throw error;
    }
}

// ========================================
// Get Paste By Paste ID
// ========================================
async function getPasteById(pasteId, userId) {

    const cacheKey = `paste:${pasteId}`;

    // ================================
    // 1. Check Redis Cache
    // ================================
    const cacheData = await redis.get(cacheKey);

    if (cacheData) {

        const paste = JSON.parse(cacheData);

        // ================================
        // Private Paste Authorization
        // ================================
        if (!paste.isPublic) {

            if (!userId) {
                throw new Error("Forbidden");
            }

            if (paste.userId.toString() !== userId) {
                throw new Error("Forbidden");
            }
        }

        // ================================
        // Increment Views Asynchronously
        // ================================
        Paste.updateOne(
            { pasteId },
            { $inc: { views: 1 } }
        ).exec().catch(err => {
            console.error("View Update Failed:", err.message);
        });

        return paste;
    }

    // ================================
    // 2. Fetch from MongoDB
    // ================================
    const paste = await Paste.findOne({ pasteId });

    if (!paste) {
        throw new Error("Paste not found");
    }

    // ================================
    // 3. Private Paste Authorization
    // ================================
    if (!paste.isPublic) {

        if (!userId) {
            throw new Error("Forbidden");
        }

        if (paste.userId.toString() !== userId) {
            throw new Error("Forbidden");
        }
    }

    // ================================
    // 4. Expiry Check
    // ================================
    if (paste.expiresAt && paste.expiresAt < new Date()) {
        throw new Error("Paste expired");
    }

    // ================================
    // 5. Increment Views
    // ================================
    paste.views++;

    await paste.save();

    // ================================
    // 6. Cache in Redis (60 seconds)
    // ================================
    await redis.set(
        cacheKey,
        JSON.stringify(paste),
        { EX: 60 }
    );

    // ================================
    // 7. Return Paste
    // ================================
    return paste;
}

// ========================================
// Get All Pastes of Logged-in User
// ========================================
async function getMyPastes(userId) {

    return await Paste.find({ userId });
}

// ========================================
// Delete a Paste
// ========================================
async function deletePaste(pasteId, userId) {

    const paste = await Paste.findOne({ pasteId });

    if (!paste) {
        throw new Error("Paste not found");
    }

    // Owner Check
    if (paste.userId.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    // Remove Redis Cache
    await redis.del(`paste:${pasteId}`);

    // Delete from MongoDB
    await Paste.deleteOne({ pasteId });

    return {
        message: "Paste deleted successfully",
    };
}

// ========================================
// Edit Existing Paste
// ========================================
async function editPaste(pasteId, userId, updateData) {

    const paste = await Paste.findOne({ pasteId });

    if (!paste) {
        throw new Error("Paste not found");
    }

    // Owner Check
    if (paste.userId.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    // Update Content
    if (updateData.content) {
        paste.content = updateData.content;
    }

    // Save Changes
    await paste.save();

    // Invalidate Redis Cache
    await redis.del(`paste:${pasteId}`);

    return paste;
}


async function toggleVisiblity(pasteId,userId){
    const paste=await Paste.findOne({pasteId});
    if(!paste){
        throw new Error("Paste not found");
    }
    if(paste.userId.toString()!=userId){
        throw new Error("Unauthorized");
    }

    //Toggle

    paste.isPublic=!paste.isPublic;

    await paste.save()

    //Delete cache
    await redis.del(`paste:${pasteId}`);

    return paste
}

module.exports = {
    createPaste,
    getPasteById,
    getMyPastes,
    deletePaste,
    editPaste,
    toggleVisiblity,
};
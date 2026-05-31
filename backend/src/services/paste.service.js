const { Paste } = require("../models/paste.model")
const { nanoid } = require("nanoid")
//for redis
const redis =require("../services/cache.services")

// Generate short unique ID
function generatePasteId() {
    return nanoid(7)
}

// Main service
async function createPaste(data, userId) {

    try {

        // 1️⃣ Validation

        if (!data.content || data.content.trim() === "") {
            throw new Error("Content is required")
        }

        // 2️⃣ Generate ID

        const pasteId = generatePasteId()

        // 3️⃣ Extract Public / Private Setting

        const isPublic =
            data.isPublic !== undefined
                ? data.isPublic
                : true

        // 4️⃣ Expiry handling

        let expiresAt

        if (data.expiry !== undefined) {

            const expiryMinutes = Number(data.expiry)

            if (isNaN(expiryMinutes) || expiryMinutes <= 0) {
                throw new Error("Invalid expiry value")
            }

            expiresAt = new Date(
                Date.now() + expiryMinutes * 60 * 1000
            )
        }

        // 5️⃣ Create object

        const paste = new Paste({
            pasteId,
            content: data.content,
            userId,
            expiresAt,
            isPublic
        })

        // 6️⃣ Save

        await paste.save()

        // 7️⃣ Return Paste

        return paste

    }
    catch (error) {

        console.error(
            "Service error:",
            error.message
        )

        throw error
    }
}
async function getPasteById(pasteId, userId) {

    const cacheKey = `paste:${pasteId}`

    // 1️⃣ Check Redis

    const cacheData = await redis.get(cacheKey)

    if (cacheData) {

        const paste = JSON.parse(cacheData)

        // Private Paste Check

        if (!paste.isPublic) {

            if (!userId) {
                throw new Error("Forbidden")
            }

            if (paste.userId.toString() !== userId) {
                throw new Error("Forbidden")
            }
        }

        // Async DB update (non-blocking)

        Paste.updateOne(
            { pasteId },
            { $inc: { views: 1 } }
        ).exec().catch(err => {
            console.error("Async view update failed:", err.message)
        })

        return paste
    }

    // 2️⃣ Fetch from DB

    const paste = await Paste.findOne({ pasteId })

    // Paste Exists?

    if (!paste) {
        throw new Error("Paste not found")
    }

    // 3️⃣ Private Paste Check

    if (!paste.isPublic) {

        if (!userId) {
            throw new Error("Forbidden")
        }

        if (paste.userId.toString() !== userId) {
            throw new Error("Forbidden")
        }
    }

    // 4️⃣ Expiry Check

    if (paste.expiresAt && paste.expiresAt < Date.now()) {
        throw new Error("Paste expired")
    }

    // 5️⃣ Increment Views

    paste.views += 1

    await paste.save()

    // 6️⃣ Store In Redis

    await redis.set(
        cacheKey,
        JSON.stringify(paste),
        "EX",
        60
    )

    // 7️⃣ Return Paste

    return paste
}

async function getMyPastes(userId){
    const pastes=await Paste.find({userId})
    return pastes
}


async function deletePaste(pasteId,userId){
    const paste=await Paste.findOne({pasteId})

    if(!paste){
        throw new Error("Paste not found")
    }

    //OwnerShip Check

    if(paste.userId.toString()!==userId){
        throw new Error("Unauthorized")
    }

    //delete cache

    await redis.del(`paste:${pasteId}`)

    //delete db

    await Paste.deleteOne({pasteId})

    return{
        message:"Paste deleted successfully"
    }
}


async function editPaste(pasteId,userId,updateData){
    const paste= await Paste.findOne({pasteId})

    if(!paste){
        throw new Error("Paste not found")
    }

    //OwnerShip check

    if(paste.userId.toString()!==userId){
        throw new Error("Unauthorized")
    }

    //Checking fields to be edited
    if(updateData.content){
        paste.content=updateData.content;
    }

    await paste.save()

    //Invalidating cache
    await redis.del(`paste:${pasteId}`)

    return paste;





}

module.exports = {
    createPaste,
    getPasteById,
    getMyPastes,
    deletePaste,
    editPaste,
}
const Bull = require('bull');
const sendingContent = new Bull('sending',{
    redis : process.env.REDIS_URL || 6379
});
const sendExtractedDoc = async (data) =>{
    await sendingContent.add({userId: data.userId, convertedText: data.extractedData});
 }
 module.exports = sendExtractedDoc;


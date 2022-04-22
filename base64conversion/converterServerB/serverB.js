const Bull = require('bull');
const axios = require('axios').default;
const URL = 'http://localhost:4000/api/convertedText'


const receiveExtractedDataQueue = new Bull('sending');
console.log('Hi')
receiveExtractedDataQueue.process(async (job) => {
   try {
       
const result = job.data.convertedText
const userId = job.data.userId
const base64 = Buffer.from(result).toString('base64')
console.log(base64)
await axios.put(URL,{userId,base64})
 
// console.log(result.userId)
// console.log(base64)
// console.log(JSON.stringify(result.convertedText));
   } catch (error) {
       console.log('An error has occurred with the converter Server', error.message)
       
   }
   
});
